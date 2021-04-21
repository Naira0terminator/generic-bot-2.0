import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class Die extends Command {
    constructor() {
        super('die', {
            aliases: ['die'],
            ownerOnly: true,
            channel: 'guild',
            description: '',
        });
    }
    async exec(message: Message) {
        const embed = this.client.util.embed()
        .setDescription('Shutting down...')
        .setColor('RED')
        await message.util?.send(embed).then(() => process.exit());
    }
}