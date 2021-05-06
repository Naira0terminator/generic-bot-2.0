import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';

export default class MessageDelete extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete',
        });
    }
    async exec(message: Message) {
        
        if(message.author.bot)
            return;

        const reactRole = client.settings.get(message.guild?.id!, `${message.channel.id}_${message.id}-reactRole`, null);

        if(reactRole) 
            await client.settings.delete(message.guild?.id!, `${message.channel.id}_${message.id}-reactRole`)
        

        client.snipeCache.set(message.channel.id, {
            msg: message,
            author: message.author,
            attatchments: message.attachments.first() ? message.attachments.first()?.proxyURL : null
        });
    }
}