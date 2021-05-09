import { Listener } from 'discord-akairo';
import { Message } from 'discord.js'
import client from '..';

export default class MessageReactionRemoveAll extends Listener {
    constructor() {
        super('reactionremoveall', {
            emitter: 'client',
            event: 'messageReactionRemoveAll',
        });
    }
    async exec(message: Message) {
       
        if(message.partial)
            await message.fetch();

        const reactRole = client.settings.get(message.guild?.id!, `${message.id}-reactRole`, null);

        // adds all reactions back if the reaction message had reaction roles setup to it
        if(reactRole) {
            for(const emote in reactRole.data)
                await message.react(emote);
        }
    }
}