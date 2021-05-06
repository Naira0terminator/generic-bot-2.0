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
        
        if(user.bot)
            return;

        const reactRole = client.settings.get(reaction.message.guild?.id!, `${reaction.message.id}_${reaction.message.id}-reactRole`, null);
        
        if(reactRole) {

            const member = reaction.message.guild?.members.cache.get(user.id);

            for(const data of reactRole.data) {
                if(data.emote === reaction.emoji) {
                    
                    const currentRole = data.role;

                    member?.roles.cache.has(data.role.id) ? 
                    await member?.roles.remove(data.role) : await member?.roles.add(data.role);

                    await reaction.users.remove(user.id);
                    
                    // if(data.replace) {
                    //     for(const d of reactRole.data)
                    //         if(member?.roles.cache.has(d.role.id) && d.role.id !== currentRole.id)
                    //             await member.roles.remove(d.role);
                    // }

                    break;
                } 
                else 
                    await reaction.users.remove(user.id);
            }
        }
    }
}