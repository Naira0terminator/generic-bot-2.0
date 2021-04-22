import { Inhibitor, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '..';

export default class CommandInhibitor extends Inhibitor {
    constructor() {
        super('cmdtoggle', {
            reason: 'Disabled Command',
            priority: 1,
        })
    }
    exec(message: Message, command: Command) {
        // in case of an error this prevents the bot spamming error messages
        if(message.author.bot)
            return false;
            
        const commandToggle: Array<string> = client.settings.get(message.guild?.id!, 'command-toggle', null);

        if(commandToggle && commandToggle.includes(command.aliases[0])) 
            return true;

        return false;
    }
}
