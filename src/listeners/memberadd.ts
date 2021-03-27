import { Listener } from 'discord-akairo';
import { GuildMember, TextChannel } from 'discord.js';

export default class MemberAdd extends Listener {
    constructor() {
        super('memberadd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }
    async exec(member: GuildMember) {
        const channel = new TextChannel(member.guild, member.guild.channels.cache.get('577399433876996107'));
        if(!channel)
            return;

            
        await channel.send(`${member} joined!`);
    }
}