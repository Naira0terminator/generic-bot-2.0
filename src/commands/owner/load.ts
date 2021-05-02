import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { join } from 'path'

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

        if(!cmd)
            return responder.fail(message, 'you must provide a valid path');

        const path = join(__dirname, '..', cmd);
        console.log(path);
        try {
            const loaded = client.commandHandler.load(path);
            responder.send(message, `**${loaded.id}** has been loaded`);
        } catch(err) {
            responder.fail(message, `could not load command`)
        }
    }
}