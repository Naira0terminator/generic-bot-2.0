import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';

export default class MemCount extends Command {
    constructor() {
        super('memcount', {
            aliases: ['member-count', 'memcount'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets the member count of the server',
        });
    }
    async exec(message: Message) {
        const humans = message.guild?.members.cache.filter(member => !member.user.bot).size;
        const bots = message.guild?.members.cache.filter(member => member.user.bot).size
       
        message.channel.send(this.client.util.embed()
        .addField('Humans: ', humans, true)
        .addField('bots: ', bots , true)
        .setColor( 'RANDOM'));
    }
}