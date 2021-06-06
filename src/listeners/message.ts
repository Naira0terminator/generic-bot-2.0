import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';
import { unicode } from '../services/utils';

export default class MessageEvent extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message: Message) {
        if(message.author.bot || message.channel.type === 'dm')
            return;

        const emoji_restrict_role    = client.settings.get(message.guild?.id!, 'emoji_restrict_role', null);
        const emoji_restrict_members = client.settings.get(message.guild?.id!, 'emoji_restrict_members', null);

        // i know this is horribly unclean code but eh it works
        if((emoji_restrict_role || emoji_restrict_members) && 
        (message.member?.roles.cache.has(emoji_restrict_role) || emoji_restrict_members.includes(message.author.id))) {
            if(message.content.match(/^<a*:.+>$/) || message.content.match(unicode))
                await message.delete();
        }

        const levelingState = client.settings.get(message.guild?.id!, 'leveling-state', true);
        if(levelingState)
            await client.leveler.handleMessage(message);

        const cleanChannels: Array<string> = client.settings.get(message.guild?.id!, 'clean-channel', null);
        if(cleanChannels && cleanChannels.includes(message.channel.id))
           await message.delete();
    }
}