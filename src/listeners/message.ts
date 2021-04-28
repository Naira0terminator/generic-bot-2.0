import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';

export default class MessageEvent extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message: Message) {
        if(message.author.bot)
            return;

        const levelingState = client.settings.get(message.guild?.id!, 'leveling-state', true);
        if(levelingState)
            await client.leveler.handleMessage(message);

        const cleanChannels: Array<string> = client.settings.get(message.guild?.id!, 'clean-channel', null);
        if(cleanChannels && cleanChannels.includes(message.channel.id))
           await message.delete();
    }
}