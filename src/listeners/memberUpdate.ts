import { Listener } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import client from '../index';

export default class MemberUpdate extends Listener {
    constructor() {
        super('memberupdate', {
            emitter: 'client',
            event: 'guildMemberUpdate',
        });
    }
    async exec(oldMember: GuildMember, newMember: GuildMember) {
        
        const getBoosterRole = client.settings.get(newMember.guild?.id!, 'booster-role', null);
        if(!getBoosterRole)
            return;

        const boosterRole = newMember.guild?.roles.cache.get(getBoosterRole);
        if(!boosterRole)
            return;

        // messages a user when they boost the server
        if(!oldMember.roles.cache.has(boosterRole.id) && newMember.roles.cache.has(boosterRole.id)) {
            await newMember.send(`thank you for boosting, ${newMember.guild.name}! use the \`boost\` command inside the server to create your custom role`).catch(() => null);
        }

        // deletes the users booster role and cleans up the db entery
        if(oldMember.roles.cache.has(boosterRole.id) && !newMember.roles.cache.has(boosterRole.id)) {
            const perkRole = client.settings.get(newMember.guild.id, `${newMember.id}-boosterRole`, null);
            await newMember.guild.roles.cache.get(perkRole)?.delete('Booster has stopped boosting');

            client.settings.delete(newMember.guild.id, `${newMember.id}-boosterRole`);
            await newMember.send(`Thank you for boosting ${newMember.guild.name}. your boost has now ended and your custom role has been deleted. please consider boosting again`)
            .catch(() => null);
        }
    }
}