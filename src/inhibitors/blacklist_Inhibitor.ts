import { Inhibitor } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '..';

export default class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklistInhibitor', {
            reason: 'blacklist',
            priority: 0,
            type: 'all'
        })
    }
    exec(message: Message) {
        return client.settings.get('blacklist', message.author.id, false);
    }
}
