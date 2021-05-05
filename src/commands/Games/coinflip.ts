import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { random } from '../../services/utils';

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

        if(!input.match(/^(heads|h)|(tails|t)$/i))
            return responder.fail(message, 'You must input either Heads (h) or Tails (t)');

        switch(input) {
            case 'h':
                input = 'heads';
                break;
            case 't':
                input = 'tails';
                break;
        }
        
        const result = random() === 1 ? 'h' : 't';
        
        const response = input === result ? `You win! it was ${result}` : `you lose its ${result}`
        responder.send(message, response, {color: 'RANDOM'});
    }
}