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
    exec(message: Message) {
        if(message.author.bot)
            return;

        client.snipeCache.set(message.channel.id, {
            msg: message,
            author: message.author,
            attatchments: message.attachments.first() ? message.attachments.first()?.proxyURL : null
        });
    }
}