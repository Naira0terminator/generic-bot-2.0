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
    async exec(oldMsg: Message, newMsg: Message) {

        if(oldMsg.author.partial)
            await oldMsg.author.fetch();
        if(oldMsg.partial)
            await oldMsg.fetch();

        if(newMsg.author.partial)
            await newMsg.author.fetch();
        if(newMsg.partial)
            await newMsg.fetch();

        if(oldMsg.author.bot)
            return;

        client.snipeCache.set('edit-'+oldMsg.channel.id, {
            old: oldMsg,
            new: newMsg,
            author: oldMsg.author,
        });
    }
}