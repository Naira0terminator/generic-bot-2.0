import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class Invite extends Command {
    constructor() {
        super('invite', {
            aliases: ['invite'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            description: 'Sends an invite link to invite the bot.',
        });
    }
    async exec(message: Message) {
        responder.send(message, '[Click here to open invite](https://discord.com/oauth2/authorize?client_id=583159512924684288&permissions=8&scope=bot)');
    }
}