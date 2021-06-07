import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';

export default class Partnerships extends Listener {
    constructor() {
        super('partnerships', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message: Message) {

        if(message.author.bot)
            return;
       
        const channelID = client.settings.get(message.guild?.id!, 'partner-channel', null);
        const channel   = !channelID ? null : message.guild?.channels.cache.get(channelID);

        if(!channel || message.channel.id !== channel.id)
            return;

        const inviteCode = message.content.match(/(https:\/\/)*discord\.gg\/.*/g);

        if(!inviteCode) 
            return message.delete();

        const invite = await client.fetchInvite(inviteCode[0]);
        const memCount = client.settings.get(message.guild?.id!, 'partner-memcount', 0);

        if(!invite || invite.guild?.memberCount! < memCount)
            return message.delete();

        const blacklists = client.settings.get(message.guild?.id!, 'partner-blacklist', null);

        if(blacklists && blacklists.includes(invite.guild?.id))
            return message.delete();

        const partnerships = await client.sql.query(`
        INSERT INTO partnerships(member_id, count, weekly) VALUES($1, 1, 1) ON CONFLICT (member_id)
        DO UPDATE SET 
        member_id = $1, 
        count = partnerships.count + 1, 
        weekly = partnerships.weekly + 1
        RETURNING count, weekly`, [message.author.id]);

        const rank = (await client.sql.query(`
            SELECT ranked.* from( 
            select member_id, RANK() OVER (ORDER BY count DESC) as rank from partnerships) 
            as ranked where member_id = $1`, [message.author.id]))
            .rows[0].rank;

        const data = partnerships.rows[0];
        
        message.channel.send(message.author, {embed: client.util.embed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setColor('RANDOM')
            .setDescription(`You have partnered with **${invite.guild?.name}**`)
            .setFooter(`Partnerships: ${data.count} | Weekly: ${data.weekly ?? 0} | Rank: ${rank}`)});
    }
}