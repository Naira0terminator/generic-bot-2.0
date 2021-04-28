import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class MissingPerms extends Listener {
    constructor() {
        super('missingPerms', {
            emitter: 'commandHandler',
            event: 'missingPermissions',
        });
    }
    async exec(message: Message, command: Command, type: string, missing: any) {

        missing =  missing.map((perm: string) => perm.replace('_', ' ').toLowerCase()).join(', ');

        const responses: any = {
            "user": `You require **${missing}** permissions to use **${command}**`,
            "client": `i am unable to execute **${command}** because i require **${missing}** permissions to execute this command`
        };

        await message.reply(responses[type]).catch(() => null);
    }
}