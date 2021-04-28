import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        });
    }
    exec(message: Message, command: Command, reason: string)  {

        const time = new Date();
        const channel = message.channel.type === "dm" ? "DM" : message.channel.name;

        const reply: Record<string, string> = {
            owner: `**${command}** is only usable by the bot owner`,
            dm: `**${command}** is only usable in direct messages`,
            guild: `**${command}** can only be used in a server`,
            "Disabled Command": `**${command}** is disabled`
        };
        
        console.log(`\n\nBlocking service:\n\nuser: ${message.author.tag} (${message.author.id})\nCommand: ${command.id}\nreason: ${reason}\nChannel: ${channel}\nTime: ${time}`);

        if(!reply[reason]) 
            return message.reply(`you cannot use **${command}**`);

        message.reply(reply[reason]);
    }
}
