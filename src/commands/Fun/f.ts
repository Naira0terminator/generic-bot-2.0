import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class F extends Command {
    constructor() {
        super('f', {
            aliases: ['f', 'respect'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content: 'Pay your respects for our fallen gamers.',
                example: ',f dead meme'
            },
            args: [
                {
                    id: 'f',
                    type: 'string',
                    match: 'rest',
                }
            ]
        });
    }
    exec(message: Message, { f }: { f: string}) {
        message.delete();
        responder.send(message, `**${message.author.username}** pays their respects${f ? ` for ${f}` : '.'}`, {color: 'RANDOM'});
    }
}