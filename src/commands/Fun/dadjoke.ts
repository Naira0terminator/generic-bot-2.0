import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import rp from 'request-promise';
import $ from 'cheerio';

export default class DadJoke extends Command {
    constructor() {
        super('dadjoke', {
            aliases: ['dadjoke'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Get a random dad joke from [icanhazdadjoke](https://icanhazdadjoke.com/)',
        });
    }
    async exec(message: Message) {
        rp('https://icanhazdadjoke.com/')
            .then(html => {
                message.util?.send($('.subtitle', html).text().slice(15));
            });
    }
}