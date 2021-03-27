import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveMember } from '../../services/utils';

export default class Emit extends Command {
    constructor() {
        super('emit', {
            aliases: ['emit'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            ownerOnly: true,
            description: '',
            args: [
                {
                    id: 'event',
                    type: 'string'
                },
                {
                    id: 'arg',
                    type: 'string',
                    default: null
                }
            ]
        });
    }
    async exec(message: Message, { event, arg }: Record<string, string>) {
        try {
            const member = resolveMember(message, arg);
            client.emit(event, member ? member : arg);
            responder.send(message, `Emitted ${event}`);
        } catch(err) {
            responder.error(message, err);
        }
    }
}