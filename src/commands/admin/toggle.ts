import { Command, CommandOptions } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Toggle extends Command {
    constructor() {
        super('toggle', {
            aliases: ['command-toggle', 'ct'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: 'ADMINISTRATOR',
            channel: 'guild',
            description: 'Enables or disables a command by its name',
            args: [
                {
                    id: 'cmd',
                    type: 'commandAlias'
                }
            ]
        });
    }
    async exec(message: Message, { cmd }: { cmd: CommandOptions }) {

        if(!cmd || !this.handler.modules.some(id => id.aliases[0] === cmd.aliases![0]))
            return responder.fail(message, 'You must provide a valid command name');

        const data: Array<string> = client.settings.get(message.guild?.id!, 'command-toggle', null);
        const cmdName = cmd.aliases![0];

        if(!data) {
            await client.settings.set(message.guild?.id!, 'command-toggle', [cmdName]);
            return responder.send(message, `**${cmdName}** has been disabled`);
        }

        if(data.includes(cmdName)) {
            const filtered = data.filter(name => name !== cmdName);
            await client.settings.set(message.guild?.id!, 'command-toggle', filtered);
            return responder.send(message, `**${cmdName}** has been enabled`);
        }
            
        data.push(cmdName);
        client.settings.set(message.guild?.id!, 'command-toggle', data);
        responder.send(message, `**${cmdName}** has been disabled`);
    }
}