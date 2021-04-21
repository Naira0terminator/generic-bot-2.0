import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Query extends Command {
    constructor() {
        super('query', {
            aliases: ['query', 'sql'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'q',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { q }: { q: string }) {
        console.log(q);
        try {
            const result = await client.sql.query(q);
            
            if(!result.rowCount)
                return responder.fail(message, 'no entries found');

            await message.channel.send(`\`\`\`json\n${JSON.stringify(result.rows)}\`\`\``);
        } catch(err) {
            responder.fail(message, `Query failed. Error: ${err.message}`);
        }
    }
}