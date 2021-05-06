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

            for(const data of reactRole.data) {
                const emote = client.emojis.cache.get(data.emote) ?? data.emote;
                
                if(!emote)
                    continue;
                
                if((emote.name ?? emote) === reaction.emoji.name) {
                    
                    const role = member?.guild.roles.cache.get(data.role);

                    if(!role)
                        continue;

                    member?.roles.cache.has(role.id) ? 
                    await member?.roles.remove(role) : await member?.roles.add(role);

                    await reaction.users.remove(user.id);
                    
                    if(reactRole.replace) {
                        for(const d of reactRole.data) {
                            
                            const resolve = member?.guild.roles.cache.get(d.role);

                            if(!resolve)
                                continue;

                            if(member?.roles.cache.has(resolve.id) && resolve.id !== role.id)
                                await member.roles.remove(resolve);
                        }
                    }

                    break;
                } 
                else 
                    await reaction.users.remove(user.id);
            }
        }
    }
}