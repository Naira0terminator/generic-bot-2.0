import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { GuildMember } from 'discord.js';
import client from '..';
import moment from 'moment';

export default class memberRemove extends Listener {
    constructor() {
        super('memberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }
    async exec(member: GuildMember) {
        const leaverLevelReset = await client.redis.get(`guild[${member.guild.id}]-exp-leaver`);

        if(leaverLevelReset === 'on') {
            await client.redis.zrem(`guild[${member.guild.id}]-exp`, `${member.id}`);
            await client.redis.zrem(`guild[${member.guild.id}]-exp-level`, `${member.id}`);
        }

        if(client.newMemberCache.has(member.id)) {
            const data  = client.settings.get(member.guild?.id, 'welcome', null);
            const cache = client.newMemberCache.get(member.id);

            if(!data || !cache)
                return;

            const channel = member.guild.channels.cache.get(cache.channel) as TextChannel;
            const msg     = await channel.messages.fetch(cache.msg);
            const diff    = moment(cache.joinDate).utc().fromNow();
            
            msg.edit('', {embed: {
                description: `**${member.user.tag}** has left the server! joined **${diff}**`,
                color: msg.embeds[0].hexColor ?? 'RANDOM',
                footer: {
                    text: `Member count: ${member.guild.memberCount}`
                }
            }})
        }
    }
}