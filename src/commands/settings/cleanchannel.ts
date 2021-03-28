import { Command } from 'discord-akairo'; 
import { Message, TextChannel } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveChannel } from '../../services/utils';

export default class CleanChannel extends Command {
    constructor() {
        super('cleanchannel', {
            aliases: ['clean-channel', 'ch'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Sets a channel as a clean channel which will delete every new none bot messages in that channel',
            args: [
                {
                    id: 'channel',
                    type: 'channel',
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all'
                }
            ]
        });
    }
    async exec(message: Message, { channel, all }: { channel: TextChannel, all: string }) {
        const cleanChannels = client.settings.get(message.guild?.id!, 'clean-channel', null);

        if(all) {
            if(!cleanChannels)
                return responder.fail(message, 'no clean channels have been set for this server');

            return responder.send(message, cleanChannels.map((ch: string) =>  resolveChannel(message, ch)).join(' '))
        }

        if(!channel)
            return responder.fail(message, 'you must provide a valid channel');

        if(!cleanChannels) 
            await client.settings.set(message.guild?.id!, 'clean-channel', [channel.id] );
        else {
            cleanChannels.push(channel.id);
            await client.settings.set(message.guild?.id!, 'clean-channel', cleanChannels);

        }
        responder.send(message, `i will now delete any none bot messages in ${channel}`);
    }
}