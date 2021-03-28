import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { resolveGuild } from '../../services/utils';

export default class Leave extends Command {
    constructor() {
        super('leave', {
            aliases: ['leave'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Makes the bot leave the given server',
            args: [
                {
                    id: 'server',
                    match: 'rest'
                },
            ]
        });
    }
    async exec(message: Message, { server }: { server: string}) {
        if(!server)
            return responder.fail(message, 'you must provide a valid server');

        const guild = resolveGuild(server);
        if(!guild)
            return responder.fail(message, 'could not resolve the given server!');

        await guild.leave();
        responder.send(message, `I have left **${guild.name}**`);
    }
}