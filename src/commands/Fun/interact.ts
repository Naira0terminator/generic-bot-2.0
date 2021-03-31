import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import { random } from '../../services/utils';

export default class Interact extends Command {
    constructor() {
        super('interact', {
            aliases: ['interact', 'love', 'suffer', 'kill', 'fuck', 'beat'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    prompt: {
                        start: (message: Message) => `${message.author}, which member would you like to interact with?`,
                        retry: (message: Message) => `${message.author}, that is not a valid member try again`,
                        timeout: (message: Message) => `${message.author}, Time ran out`,
                        ended: (message: Message) => `${message.author}, The command has been cancelled!`,
                        time: 15000,
                        retries: 1,
                    }
                }
            ]
        });
    }
    async exec(message: Message, { member }: { member: GuildMember }) {

        if(message.util?.parsed?.alias === 'interact') 
            return responder.send(message, `Interaction commands: ${this.aliases.join(', ')}`);
        
        // takes the command alias as an argument then uses it to run a function with eval from resource.ts file.
        // it should almost always return an array and it will get a random enetery from it and return it.
        const response = (alias: string) => {
            const self  = `'**${message.member?.user.username}**'`;
            const other = `'**${member?.user.username}**'`;

            const func = `
            const responses = require('../../resources/responses');
            responses.${alias.toLowerCase()}(${self}, ${other});
            `;

            const array = String(eval(func)).split(',');
            return array[random(array.length)];
        }

        responder.send(message, response(message.util?.parsed?.alias!), {color: 'RANDOM'});
    }
}