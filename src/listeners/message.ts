import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';

export default class MessageEvent extends Listener {
    constructor() {
        super('message', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message: Message) {
        await client.leveler.handleMessage(message);
    }
}