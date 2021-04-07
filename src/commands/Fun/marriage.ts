import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import moment from 'moment';
import { sql } from '../../services/database';

export default class Marry extends Command {
    constructor() {
        super('marriage', {
            aliases: ['marriage'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'divorce',
                    match: 'flag',
                    flag: 'divorce',
                }
            ]
        });
    }
    async exec(message: Message, { divorce }: {divorce: string}) {

        const data = await sql.query(`SELECT couple, date FROM marriage WHERE guild = '${message.guild?.id}' and '${message.author.id}' = ANY(couple) `);

        if(divorce && data.rowCount) {
            await sql.query(`DELETE FROM marriage WHERE guild = '${message.guild?.id}' and '${message.author.id}' = ANY(couple)`)
            return responder.send(message, 'Your divorce is finalized!');
        }

        if(!data.rowCount) 
            return responder.fail(message, `You are not married`);
        
        const resolve = (user: string) => {
            let res = this.client.users.cache.get(user)?.username;
            return res ? res : 'Unknown User';
        }

        const date = moment(data.rows[0].date);

        message.channel.send(this.client.util.embed()
        .setDescription(`**${resolve(data.rows[0].couple[0])}** ❤ **${resolve(data.rows[0].couple[1])}**`)
        .setColor('#FF1493')
        .setFooter(`Married since ${date.fromNow()}`));
    }
}