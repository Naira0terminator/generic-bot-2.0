import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { evaluate } from 'mathjs';

export default class Math extends Command {
    constructor() {
        super('math', {
            aliases: ['math', 'calculate', 'calc'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content:'A command that can do basic and advanced calculations including conversions',
                examples: ['5+10 * (500/20)', '30kgs to lbs', 'sqrt(4)'],
            },
            args: [
                {
                    id: 'calculation',
                    match: 'rest',
                }
            ],
        });
    }
    async exec(message: Message, { calculation }: any) {
        if(!calculation)
            return responder.fail(message, 'you must provide a valid calculation!');

        try {
            responder.send(message, `Output: ${evaluate(calculation)}`);
        } catch(err) {
            responder.fail(message, `That is not a valid calculation ${err.message}`)
        }
    }
}