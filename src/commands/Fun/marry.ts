import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import { includesOne } from '../../services/utils';
import { sql } from '../../services/database';

export default class Marry extends Command {
    constructor() {
        super('marry', {
            aliases: ['marry'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'target',
                    type: 'member',
                }
            ]
        });
    }
    async exec(message: Message, { target }: { target: GuildMember}) {

        if(!target || target.user.bot || target.id === message.author.id)
            return responder.fail(message, 'you must provide a valid user');


        const data = await sql.query(`SELECT couple FROM marriage WHERE guild = '${message.guild?.id}' and '${message.author.id}' = ANY (couple)`);
        
        if(data.rowCount)
            return responder.fail(message, 'You or the provided user is already married');

        const filter = (message: Message) => includesOne(message.content.toLowerCase(), ['yes', 'y', 'no', 'n']) && !message.author.bot && message.author.id === target.id;
        const collector = message.channel.createMessageCollector(filter, {time: 35000});

        message.channel.send(`(${target}) **${message.author.username}** has proposed marriage do you accept? (answer with "yes" or "no")`);

        collector.once('collect', async (msg: Message) => {

            if(includesOne(msg.content.toLowerCase(), ['yes', 'y'])) {
                try {
                    await sql.query(`INSERT INTO marriage(guild, couple, date) VALUES(${message.guild?.id}, ARRAY [${message.author.id}, ${target.id}], '${new Date().toString()}')`)
                } catch(err) {
                    return responder.error(message, `Could not create marriage table ${err}`);
                }
                
                collector.stop('response');
                return responder.send(message, `${target.user.username} and ${message.author.username} are now married!`);
            }

            if(includesOne(msg.content.toLowerCase(), ['no', 'n'])) {
                collector.stop('response');
                return responder.send(message, '... your marriage proposal has been denied :(');
            }
        });

        collector.on('end', (_, reason: string) => {
            if(reason === 'response')
                return;

            return responder.fail(message, `${target.user.username} failed to respond in time`);
        });
    }
}