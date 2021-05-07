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
            for(const emote of Object.keys(reactRole.data)) {
                if(!reaction.message.reactions.cache.has(emote) || !reaction.message.reactions.cache.find(e => e.emoji.name === emote)) {
                    await reaction.message.react(emote);
                }
            }
        }
    }
}