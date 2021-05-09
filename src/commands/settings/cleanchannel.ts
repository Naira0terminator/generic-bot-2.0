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
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild',
            description: 'Sets a channel as a clean channel which will delete every new none bot messages in that channel\n use `-all` to view all & `-reset` to reset all',
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
                },
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset'
                }
            ]
        });
    }
    async exec(message: Message, { channel, all, reset }: { channel: TextChannel, all: string, reset: string }) {
        const cleanChannels: Array<string> = client.settings.get(message.guild?.id!, 'clean-channel', null);

        if(all) {
            if(!cleanChannels || !cleanChannels.length)
                return responder.fail(message, 'no clean channels have been set for this server');

            return responder.send(message, cleanChannels.map((ch: string) =>  resolveChannel(message, ch)).join(' '))
        }

        if(reset) {
            await client.settings.delete(message.guild?.id!, 'clean-channel');
            return responder.send(message, 'all clean channels have been reset for this server')
        }

        if(!channel)
            return responder.fail(message, 'you must provide a valid channel');

        if(cleanChannels && cleanChannels.includes(channel.id)) {
            const removed = cleanChannels.filter((id: string) => id !== channel.id);
            await client.settings.set(message.guild?.id!, 'clean-channel', removed);
            return responder.send(message, `${channel} has been removed from the list of clean channels!`);
        }

        if(!cleanChannels) 
            await client.settings.set(message.guild?.id!, 'clean-channel', [channel.id]);
        else {
            cleanChannels.push(channel.id);
            await client.settings.set(message.guild?.id!, 'clean-channel', cleanChannels);
        }
        
        responder.send(message, `i will now delete any none bot messages in ${channel}`);
    }
}