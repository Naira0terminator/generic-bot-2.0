import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import Responder from '../../services/responder';

export default class Ping extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping', 'pong'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Shows the response time of the webhook latancy and the message latancy'
        });
    }
    async exec(message: Message) {
        
        const sent = await message.util?.send('pinging...');
        const sentTime = sent?.editedAt?.getTime() || sent?.createdAt.getTime();
        const timeDiff = (sentTime ?? 0) - (message.editedAt?.getTime() || message.createdAt?.getTime())
        
        message.util?.send(this.client.util.embed()
        .setDescription(`**Websocket** \`${Math.round(this.client.ws.ping)} MS\`\n**message** \`${timeDiff} MS\``)
        .setColor('RANDOM'));
    }
}