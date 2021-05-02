import { Command } from 'discord-akairo'; 
import { Message, User } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Whitelist extends Command {
    constructor() {
        super('whitelist', {
            aliases: ['whitelist', 'wl'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'whitelists a given user from the blacklist',
            args: [
                {
                    id: 'user',
                    type: 'user',
                }, 
            ]
        });
    }
    async exec(message: Message, { user }: { user: User }) {
        if(!user)
            return responder.fail(message, 'You must provide a valid user');

        await client.settings.delete('blacklist', user.id);
        responder.send(message, `**${user.tag}** has been Whitelisted`);
    }
}