import { redis } from './database';
import { Message, Collection, Role, MessageEmbed, GuildMember } from 'discord.js';

export default class Leveler {
    private cooldowns: Collection<string, Collection<string, Number>>
    
    constructor() {
        this.cooldowns = new Collection();
    }

    async handleMessage(message: Message) {

        if(message.author.bot || message.channel.type == 'dm')
            return;

        if(await redis.sismember(`guild[${message.guild?.id}]-exp-blacklist-channel`, message.channel.id)) 
            return;
        
        const blacklistRoles = await redis.smembers(`guild[${message.guild?.id}]-exp-blacklist-role`);

        for(const role of blacklistRoles) {
            if(message.member?.roles.cache.has(role)) 
                return;
        }

        const cooldownAmount = await redis.hget(`guild[${message.guild?.id}]-exp-modifiers`, 'cooldown');
        const cooldown = Number(cooldownAmount) ?? 15000;

        if(!this.cooldowns.has(message.author.id))
            this.cooldowns.set(message.author.id, new Collection())

        const now = Date.now();

        const userCooldown = this.cooldowns.get(message.author.id);

        if(this.cooldowns.has(message.author.id)) {
            if(now < Number(userCooldown?.get(message.author.id)) + cooldown)
                return;
        }

        userCooldown?.set(message.author.id, now);

        setTimeout(() => userCooldown?.delete(message.author.id), cooldown);

        this.handleLevelUp(message);
    } 

    private async handleLevelUp(message: Message) {
        const expMod = Number(await redis.hget(`guild[${message.guild?.id}]-exp-modifiers`, 'exp-modifier'));
        // generates exp in the range of 5 and 8 and adds an exp modifier by default its 1
        const expGen = (!expMod ? 1 : expMod) + Math.floor(Math.random() * (8 - 5) + 5);
        //console.log(expGen);
        const exp = Number(await redis.zincrby(`guild[${message.guild?.id}]-exp`, expGen, message.author.id));

        // gets the level of the user as a number and if it doesnt exist it creates an entry
        let level = Number(await redis.zscore(`guild[${message.guild?.id}]-exp-level`, message.author.id));
        if(!level)
            level = Number(await redis.zadd(`guild[${message.guild?.id}]-exp-level`, 0, message.author.id));

        // if the member is at level 0 and they have more then x exp or if the user isnt level 0 and they have more exp then their level multiplied by 150 it will level them up
        // probably not the best way to handle leveling up but it works well enough
        if((level === 0 && exp > 150) || (exp > level * 150 && level !== 0)) {
            const currentLevel = await redis.zincrby(`guild[${message.guild?.id}]-exp-level`, 1, message.author.id);
            await this.setExp(message.member, 0);

            let roles: Array<Role> = [];

            // dynamically checks if their are any roles to be given to the user at the users current level and if so gives them the role and adds it to the array for later display.
            const addRole = async (type: string) => {
                if(redis.hexists(`guild[${message.guild?.id}]-exp-${type}`, currentLevel)) {
                    const levelRole = await redis.hget(`guild[${message.guild?.id}]-exp-${type}`, currentLevel);
                    if(!levelRole)
                        return;

                    const role = message.guild?.roles.cache.get(levelRole);
                    if(role) {
                        await message.member?.roles.add(role.id);
                        roles.push(role);
                    }
                }
            }

            await addRole('levelRoles');
            await addRole('reward');

            // checks what the last level role the user had before the current level was
            // this is the best way my pea brain could find of making sure it wouldnt remove the last level role the user had
            const lastLevelRole = async () => {
                for(let i = Number(currentLevel); i !== 0; i--) {
                    const validField = await redis.hget(`guild[${message.guild?.id}]-exp-levelRoles`, String(i));
                    
                    if(validField)
                        return validField;
                }
                return null;
            }

            // if role replacing is on it will remove every role till the users current role.
            // this is done instead of only removing the last role so it always syncs up.
            const lastRole = await lastLevelRole();
            if(await redis.get(`guild[${message.guild?.id}]-exp-replace`) === 'on') {
                for(let i = 1; i < Number(currentLevel); i++) {
                    const levelField = await redis.hget(`guild[${message.guild?.id}]-exp-levelRoles`, String(i));
                    if(!levelField)
                        continue;
                    
                    if(levelField === lastRole)
                        break;

                    const validRole = message.guild?.roles.cache.get(levelField);
                    if(validRole) 
                        await message.member?.roles.remove(validRole);
                }
            }
            
            if(await redis.get(`guild[${message.guild?.id}]-exp-msg`) === 'on') {
                const rank = await redis.zrank(`guild[${message.guild?.id}]-exp-level`, message.author.id);
                message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription(`You are now level **${currentLevel}** ${roles.length ? `You have gained the following role(s) ${roles.join(',')}` : ''}`)
                .setFooter(`Server Rank #${rank ? rank + 1 : 'No rank'}`)
                .setColor(message.member?.displayHexColor || '000000'));
            }
        }
    }

    async addExp(member: GuildMember, amount?: number): Promise<boolean> {

        if(!amount)
            amount = Math.floor(Math.random() * (8 - 5) + 5);

        const exp = await redis.zincrby(`guild[${member.guild?.id}]-exp`, amount, member.id);

        if(!exp)
            return false;

        return true;
    }

    async setExp(member: GuildMember | null, amount: number): Promise<boolean> {
        if(!member)
            return false;

        const exp = await redis.zadd(`guild[${member?.guild?.id}]-exp`, amount, member.id)

        if(!exp)
            return false;

        return true;
    }

    async addLevel(member: GuildMember | null, amount: number): Promise<boolean> {
        if(!member)
            return false;

        const level = await redis.zincrby(`guild[${member?.guild?.id}]-exp-level`, amount, member.id)

        if(!level)
            return false;

        return true;
    }

    async setLevel(member: GuildMember, amount: number): Promise<boolean> {
        const level = await redis.zadd(`guild[${member.guild?.id}]-exp-level`, amount, member.id)

        if(!level)
            return false;

        return true;
    }

    async getLevel(member: GuildMember | null): Promise<string> {
        return redis.zscore(`guild[${member?.guild?.id}]-exp-level`, member?.id || '')
    }

    async getExp(member: GuildMember | null): Promise<string> {
        return redis.zscore(`guild[${member?.guild?.id}]-exp`, member?.id || '')
    }

    async getRank(member: GuildMember | null): Promise<number|null> {
        return redis.zrank(`guild[${member?.guild?.id}]-exp`, member?.id || '')
    }
}