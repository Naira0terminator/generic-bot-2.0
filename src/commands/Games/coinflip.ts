import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { includesOne } from '../../services/utils';

export default class CoinFlip extends Command {
    constructor() {
        super('cf', {
            aliases: ['coin-flip', 'cf'],
            cooldown: 5000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'HEADS OR TAILS',
            args: [
                {
                    id: 'input',
                    type: 'string'
                }
            ]
        });
    }
    exec(message: Message, { input }: { input: string }) {

        if(!includesOne(input, ['heads', 'h', 'tails', 't']))
            return responder.fail(message, 'You must input either yes(y) or no(n)');

        switch(input) {
            case 'h':
                input = 'heads';
            case 't':
                input = 'tails';
        }

        const h_t = ['heads', 'tails'];
        const result = h_t[Math.floor(Math.random() * h_t.length)];

        if(input === result)
            return responder.send(message, `Correct! you win! its ${result}`);
        
        return responder.send(message, `you lose its ${result}`, {color: 'RED'});
    }
}