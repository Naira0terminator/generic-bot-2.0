import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import leaderboard from '../../services/leaderboard';

export default class Rank extends Command {
    constructor() {
        super('rank', {
            aliases: ['rank', 'level', 'lvl'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Shows your current level',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (message: Message) => message.member
                },
                {
                    id: 'lb',
                    match: 'flag',
                    flag: 'lb',
                }
            ]
        });
    }
    async exec(message: Message, { member, lb }: { member: GuildMember, lb: string}) {

        if(lb) 
            return await leaderboard('exp-level', message);

        const serverRank = Number(await client.redis.zrank(`guild[${message.guild?.id}]-exp-level`, `${member.id}`));
        const exp = Number(await client.redis.zscore(`guild[${message.guild?.id}]-exp`, `${member.id}`));

        const level = Number(await client.redis.zscore(`guild[${message.guild?.id}]-exp-level`, `${member.id}`));
        if(level === 0) 
            return responder.fail(message, 'The provided member does not have a rank. start talking to earn exp!');

        const precentage = exp / (150 * level);
        const progress = Math.round(10 * precentage);
        let bar = `${'■'.repeat(progress)}${'□'.repeat(10 - progress)}`
        
        message.channel.send(this.client.util.embed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .addField(`Level ${level}`, `[${bar}](https://www.youtube.com/watch?v=jXglHzoG_Zs) ${Math.round(precentage * 100)}% (${exp}/${level * 150})`)
        .setFooter(`Rank #${serverRank + 1}`)
        .setColor(member.displayHexColor));
    }
}