import { Listener, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import ms from 'ms';

export default class CooldownListener extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown',
        });
    }

    async exec(message: Message, command: Command, remaining: number) {
        
        message.reply(`**${command}** is on cooldown you must wait **${ms(remaining, {long: true})}** to use it again!`)
            .then((m: Message) => m.delete({timeout: 5000}) && message.delete());
        
    }
}
