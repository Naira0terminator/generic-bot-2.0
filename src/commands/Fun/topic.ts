import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import rp from 'request-promise';
import $ from 'cheerio';

export default class Topic extends Command {
    constructor() {
        super('topic', {
            aliases: ['topic'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Returns a random conversation topic from [Conversation starters](https://www.conversationstarters.com/generator.php)',
        });
    }
    async exec(message: Message) {
        rp('https://www.conversationstarters.com/generator.php')
        .then(html => {
            message.channel.send($('#random', html).text());
        })
        .catch(() => message.channel.send("Could not get topic!"));
    }
}