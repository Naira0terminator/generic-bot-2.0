import { Message } from 'discord.js' 
import client from '../index'

export default async function leaderboard(type: string, message: Message) {
    let start = 0, end = 9;

    const msg = await message.channel.send(await createEmbed());

    await msg.react('⬅️');
    await msg.react('➡️');

    const collector = msg.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60000});

    collector.on('collect', async r => {
        if(r.emoji.name === '➡️') {
            start += 10,
            end += 10,
            await msg.edit(await createEmbed());
        }
        if(r.emoji.name === '⬅️') {
            start -= 10;
            end -= 10;
            await msg.edit(await createEmbed());
        }
        r.users.remove(message.author.id);
    });

    collector.on('end', async () => {
        await msg.reactions.removeAll();
        await msg.edit(`message is now inactive!`);
    });

    async function createEmbed() {
        const data = await client.redis.zrevrange(`guild[${message.guild?.id}]-${type}`, start, end, "WITHSCORES");
        const rank = await client.redis.zrank(`guild[${message.guild?.id}]-${type}`, `${message.author.id}`);
        
        const format = data.reduce((a: any, c, i) => {
            const idx = i / 2 | 0;
            if(i % 2) {
                a[idx].score = c
            } else {
                a[idx] = {id: c};
            }
            return a;
        }, []);
        
        const mapped = await Promise.all(format
            .filter((data: any) => message.guild?.members.cache.has(data.id))
            .map(async (data: any) => {
                const member = message.guild?.members.cache.get(data.id);
                const memRank = await client.redis.zrevrank(`guild[${message.guild?.id}]-${type}`, member!.id);
                return `\`[${memRank! + 1}]\` | ${member?.user.tag} - ${data.score}`;
            }));

        return client.util.embed()
        .setTitle('Leaderboard')
        .setDescription(mapped)
        .setFooter(`You are #${rank! + 1}`)
        .setColor('RANDOM');
    }
}