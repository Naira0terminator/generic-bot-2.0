import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Name extends Command {
    constructor() {
        super('', {
            aliases: [''],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
        });
    }
    async exec(message: Message) {
        
    }
}