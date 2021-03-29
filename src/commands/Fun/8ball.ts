import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { random } from '../../services/utils';

export default class EightBall extends Command {
    constructor() {
        super('8ball', {
            aliases: ['8ball'],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Ask the 8ball a question to get an arbitary answer',
            args: [
                {
                    id: 'q'
                }
            ]
        });
    }
    async exec(message: Message, { q }: any) {
        if(!q)
            return responder.fail(message, 'You must ask the 8ball a question!');

        const answers = ['Yes', 'No', 'Possibly', 'Dont count on it', 'Most likely', 'Outlook not so good', 'Outlook good'];
        responder.send(message, answers[random(answers.length)], {color: 'RANDOM'});
    }
}