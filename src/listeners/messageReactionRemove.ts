import { Listener } from 'discord-akairo';
import { MessageReaction, User } from 'discord.js'
import client from '..';

export default class MessageReactionRemove extends Listener {
    constructor() {
        super('reactionremove', {
            emitter: 'client',
            event: 'messageReactionRemove',
        });
    }
    async exec(reaction: MessageReaction, user: User) {
        
        if(reaction.partial)
            await reaction.fetch();
        if(reaction.message.partial)
            await reaction.message.fetch();
        if(user.partial)
            await user.fetch();

        const reactRole = client.settings.get(reaction.message.guild?.id!, `${reaction.message.id}-reactRole`, null);

        if(reactRole) {
            for(const data of reactRole.data) {
                if(!reaction.message.reactions.cache.has(data.emote) || !reaction.message.reactions.cache.find(emote => emote === data.emote)) {
                    const emote = client.emojis.cache.get(data.emote) ?? data.emote;
                    
                    if(!emote)
                        continue;

                    await reaction.message.react(emote);
                }
            }
        }
    }
}