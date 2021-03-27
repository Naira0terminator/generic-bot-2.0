import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Mute extends Command {
    constructor() {
        super('mute', {
            aliases: ['mute'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'target',
                    type: 'member',
                },
                {
                    id: 'reason',
                    type: 'string',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message) {
        
    }
}