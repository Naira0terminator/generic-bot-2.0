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

        // adds reactions back if the reaction message had reaction roles setup to it
        if(reactRole) {
            const emote = reaction.emoji.id! ?? reaction.emoji.name;
            if(emote in reactRole.data)
                await reaction.message.react(emote);
        }
    }
}