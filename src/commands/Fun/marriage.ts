import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import marriage from '../../models/marriage';
import moment from 'moment';

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
        const isMarried = await marriage.findOne({where: {spouce1: message.member?.id}});

        if(divorce && isMarried) {
            await isMarried.destroy();
            return responder.send(message, 'Your divorce is finalized!');
        }

        if(!isMarried) 
            return responder.fail(message, `You are not married`);
        
        const resolve = (user: string) => {
            let res = this.client.users.cache.get(user)?.username;

            if(!res)
                res = 'Unknown User';

            return res;
        }
        
        const spouce1 = String(isMarried.get('spouce1'));
        const spouce2 = String(isMarried.get('spouce2'));
        const date = moment(new Date(String(isMarried.get('date'))))
        
        message.channel.send(this.client.util.embed()
        .setDescription(`**${resolve(spouce1)}** ❤ **${resolve(spouce2)}**`)
        .setColor('#FF1493')
        .setFooter(`Married since ${date.fromNow()}`));
    }
}