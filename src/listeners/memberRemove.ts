import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { redis } from '../services/database'


export default class memberRemove extends Listener {
    constructor() {
        super('memberRemove', {
            emitter: 'client',
            event: 'guildMemberRemove'
        });
    }
    async exec(member: GuildMember) {
        const leaverLevelReset = await redis.get(`guild[${member.guild.id}]-exp-leaver`);

        if(leaverLevelReset === 'on') {
            await redis.zrem(`guild[${member.guild.id}]-exp`, `${member.id}`);
            await redis.zrem(`guild[${member.guild.id}]-exp-level`, `${member.id}`);
        }
    }
}