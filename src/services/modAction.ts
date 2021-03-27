import { GuildMember, Role } from 'discord.js';
import client from '../index';
import { queries } from './database';

interface CaseData {
    author: GuildMember,
    target: GuildMember
}

export default class ModAction {
    // case stores data for each new case like the guild and such 
    // case id is used to retrieve it
    private case: Map<number, CaseData>;
    private caseID: number;

    constructor() {
        this.case = new Map();
        this.caseID = 0;
    }

    public async mute(author: GuildMember, target: GuildMember, duration: number, reason: string = 'No reason provided') {
        const currentID = this.caseID++
        this.case.set(currentID, {author: author, target: target});

        const 
            guild = author.guild,
            muteRoleID = client.settings.get(guild.id, queries.settings.muteRole, null),
            removeRolesID = client.settings.get(guild.id, queries.settings.removeRoles, null);

            if(!muteRoleID)
                return Error('no mute role has been set for this server');

            const muteRole = guild.roles.cache.get(muteRoleID);
            

        if(!this.validatePerms('mute', currentID)) 
            return Error('you do not have perms to execute this command');

        
    }

    private validatePerms(action: string, caseID: number) {
        const c = this.case.get(caseID);
        const guild = c?.author.guild;

        if(!c)
            return false;

        const permRoles = client.settings.get(guild!.id, `${action}-perm-role`, null);

        if(!permRoles)
            return false;

        for(const id of permRoles) {
            const role = guild?.roles.cache.get(id);
            const hasRole = role && c.author.roles.cache.has(role.id) ? true : false;

            if(!hasRole)
                continue;

            return true;
        }

        return false;
    }
}