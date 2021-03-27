import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import client from '../../index';
import leaderboard from '../../services/leaderboard';

export default class Cats extends Command {
    constructor() {
        super('cats', {
            aliases: ['cats', 'puthy'],
            cooldown:8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Shows how many cats you have',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (message: Message) => message.member,
                },
                {
                    id: 'lb',
                    match: 'flag',
                    flag: 'lb'
                }
            ]
        });
    }
    async exec(message: Message, { member, lb }: { member: GuildMember, lb: string }) {
        
        if(lb)
            return await leaderboard('catch', message);

        const data = await client.redis.zscore(`guild[${message.guild?.id}]-catch`, `${member.id}`);
        const rank = await client.redis.zrank(`guild[${message.guild?.id}]-catch`, `${member.id}`);

        message.channel.send(this.client.util.embed()
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .setColor(member.displayHexColor === '#000000' ? 'RANDOM' : member.displayHexColor)
        .setDescription(`**Cats** ${!data ? 0 : data} | **Rank** ${!data ? 'No rank' : `#${rank! + 1}`}`));
    }
}