import { Listener, AkairoError, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class ErrorEvent extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }
    exec(err: AkairoError, message: Message, command: Command) {
        console.log(`An Error occured executing ${command?.id} ${err.stack}`);
        responder.error(message, err.message);
    }
}