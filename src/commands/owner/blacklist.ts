import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Blacklist extends Command {
    constructor() {
        super('blacklist', {
            aliases: ['blacklist', 'bl'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Blacklist a given user from using the bot',
            args: [
                {
                    id: 'user',
                    type: 'string',
                }, 
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: 'lookup',
                    match: 'flag',
                    flag: '-lookup'
                }
            ]
        });
    }
    async exec(message: Message, { user, reason, lookup }: { user: string, reason: string, lookup: string }) {

        if(user && lookup) {
            const data = client.settings.get('blacklist', user, null);

            if(!data)
                return responder.fail(message, 'That user is not blacklisted');

            const resolved = client.users.cache.get(user)?.username ?? user;
            return responder.send(message, `${resolved}: ${data}`);
        }

        if(!user || !reason)
            return responder.fail(message, 'You must provide a valid user and a reason');

        const resolved = client.users.cache.get(user) || message.mentions.users.first();

        if(!resolved) 
           return responder.fail(message, 'Could not validate user');

        await client.settings.set('blacklist', resolved!.id, reason);
        responder.send(message, `**${resolved.tag}** has been blacklisted`);
    }
}