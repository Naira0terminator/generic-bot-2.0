import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../../index';
import leaderboard from '../../services/leaderboard';

export default class Ping extends Command {
    constructor() {
        super('test', {
            aliases: ['t1', 'test'],
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'a testing command',
            separator: ',',
            args: [
                {
                    id: 'cmd',
                    match: 'separate',
                }
            ]
        });
    }
    async exec(message: Message, { cmd }: {cmd: string[]}) {
        await leaderboard('exp-level', message);
    }
}