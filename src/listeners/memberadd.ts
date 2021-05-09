import { Listener } from 'discord-akairo';
import { GuildMember, TextChannel } from 'discord.js';
import client from '..';
import { varParseObj, varParser } from '../services/utils';

export default class MemberAdd extends Listener {
    constructor() {
        super('memberadd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member: GuildMember) {

       const autoRole = client.settings.get(member.guild?.id!, 'auto-role', null);

        if(autoRole) 
            await member.roles.add(autoRole)
        

        // welcome message 

        const welcomeData = client.settings.get(member.guild?.id, 'welcome', null);

        if(welcomeData) {
            const channel = member.guild.channels.cache.get(welcomeData.channel) as TextChannel;

            if(!channel)
                return;

            if(typeof welcomeData.content === 'object') {
                varParseObj(welcomeData.content, member);
            }

            const msg = await channel.send(typeof welcomeData.content === 'object' ? {embed: welcomeData.content} : varParser(welcomeData.content, member));
            
            client.newMemberCache.set(member?.id, {
                msg: msg.id,
                channel: channel.id,
                joinDate: member.joinedAt
            });
        }
            
    }
}