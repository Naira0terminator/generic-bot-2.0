import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import marriage from '../../models/marriage';
import { Op } from 'sequelize';
import { includesOne } from '../../services/utils';

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

        // checks if the target is already married and returns if they are.
        const isTargetMarried = await marriage.findOne({where: { [Op.or]: [ { spouce1: target.id } , { spouce2: target.id}] }});
        
        if(isTargetMarried)
            return responder.fail(message, 'That user is already married!');

        const isMarried = await marriage.findOne({where: {spouce1: message.member?.id}});

        if(isMarried) {
            let spouce = String(await isMarried.get('spouce2'));
            spouce = spouce ? client.users.cache.get(spouce)?.username! : 'Unknown';
            return responder.fail(message, `You are already married to ${spouce}`)
        }

        const filter = (message: Message) => includesOne(message.content.toLowerCase(), ['yes', 'y', 'no', 'n']) && !message.author.bot && message.author.id === target.id;
        const collector = message.channel.createMessageCollector(filter, {time: 35000});

        message.channel.send(`(${target}) **${message.author.username}** has proposed marriage do you accept? (answer with "yes" or "no")`);

        collector.once('collect', async (msg: Message) => {

            if(includesOne(msg.content.toLowerCase(), ['yes', 'y'])) {
                try {
                    await marriage.create({
                        spouce1: message.member?.id,
                        spouce2: target.id,
                    });
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