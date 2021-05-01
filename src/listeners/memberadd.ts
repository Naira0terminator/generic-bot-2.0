import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import client from '..';

export default class MemberAdd extends Listener {
    constructor() {
        super('memberadd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member: GuildMember) {
       const autoRole = client.settings.get(member.guild?.id!, 'auto-role', null);
        if(autoRole) {
            await member.roles.add(autoRole)
        }
    }
}