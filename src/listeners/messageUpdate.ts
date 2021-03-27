import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '..';

export default class MessageUpdate extends Listener {
    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate',
        });
    }
    exec(oldMsg: Message, newMsg: Message) {
        if(oldMsg.author.bot)
            return;

        client.snipeCache.set('edit-'+oldMsg.channel.id, {
            old: oldMsg,
            new: newMsg,
            author: oldMsg.author,
        });
    }
}