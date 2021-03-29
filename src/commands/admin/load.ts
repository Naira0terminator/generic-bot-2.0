import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Load extends Command {
    constructor() {
        super('load', {
            aliases: ['load'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'cmd',
                    type: 'string',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { cmd }: { cmd: string }) {
        
        try {
            client.commandHandler.load(cmd);
            responder.send(message, `**${cmd}** has been loaded`);
        } catch(err) {
            responder.fail(message, `could not load **${cmd}**`)
        }
    }
}