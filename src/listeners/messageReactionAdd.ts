import { Listener } from 'discord-akairo';
import { MessageReaction, User } from 'discord.js'
import client from '..';

export default class MessageReactionAdd extends Listener {
    constructor() {
        super('reactionadd', {
            emitter: 'client',
            event: 'messageReactionAdd',
        });
    }
    async exec(reaction: MessageReaction, user: User) {
        
        if(reaction.partial)
            await reaction.fetch();
        if(reaction.message.partial)
            await reaction.message.fetch();
        if(user.partial)
            await user.fetch();

        if(user.bot)
            return;

        const reactRole = client.settings.get(reaction.message.guild?.id!, `${reaction.message.id}-reactRole`, null);
        
        if(reactRole) {

            const member = reaction.message.guild?.members.cache.get(user.id);

            if(reactRole.data[reaction.emoji.id!] ?? reactRole.data[reaction.emoji.name]) {
                const role = member?.guild.roles.cache.get(reactRole.data[reaction.emoji.id!] ?? reactRole.data[reaction.emoji.name]);
                
                if(!role)
                    return;
                
                member?.roles.cache.has(role.id) ? 
                await member?.roles.remove(role) : await member?.roles.add(role);

                
                if(reactRole.replace) {
                    for(const id of Object.values(reactRole.data)) {
                        if(member?.roles.cache.has(id as string) && id !== role.id)
                            await member.roles.remove(id as string);
                    }
                }
            } 
            await reaction.users.remove(user.id);
        }
    }
}