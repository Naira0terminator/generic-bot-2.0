import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveRole } from '../../services/utils';

export default class SelfRole extends Command {
    constructor() {
        super('selfrole', {
            aliases: ['self-role', 'sf'],
            cooldown: 8000,
            clientPermissions: 'MANAGE_ROLES',
            channel: 'guild',
            description: 'lets members assign roles to themselves. use the command without arguments to see the usage',
            args: [
                {
                    id: 'r',
                    match: 'rest',
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set',
                },
                {
                    id: 'remove',
                    match: 'flag',
                    flag: '-remove'
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: 'all'
                },
                {
                    id: 'replace',
                    match: 'flag',
                    flag: '-replace'
                }
            ]
        });
    }
    async exec(message: Message, { r, set, remove, all, replace }: any) {
        
        const roles: Array<string> = await client.settings.get(message.guild?.id!, 'self_assign', null);
        const hasPerms = message.member?.permissions.has('MANAGE_ROLES') ? true : false;
        const failMessage = 'You must have manage roles perms to add self assign roles';
        const replaceState =  await client.settings.get(message.guild?.id!, 'self_assign-replace', false);

        if(all) {
            return responder.send(message, !roles || !roles.length ? 'No self assing roles set' : roles.map(id => resolveRole(message, id)).join(', '));
        }

        if(replace) {
            await client.settings.set(message.guild?.id!, 'self_assign-replace', replaceState ? false : true);
            return responder.send(message, `i **${replaceState ? 'wont' : 'will'}** replace the members other self assign roles`)
        }

        if(!r) {
            return responder.send(message, `
            to assign a role (as long as its been set as a self assign role) use the command with the desired role
            **Example** \`.sf epic role\`
            
            use \`all\` as an argument to view all self assign roles
            
            to set a role as a self assign role use \`-set Role\` and to remove it use \`-remove Role\` (must have manage roles permission)`);
        }   

        const role = resolveRole(message, r);

        if(!role)
            return responder.fail(message, 'Could not resolve role');

        if(set) {
            if(!hasPerms)
                return responder.fail(message, failMessage);

            if(!roles)
                await client.settings.set(message.guild?.id!, 'self_assign', [role.id]);
            else {
                roles.push(role.id);
                await client.settings.set(message.guild?.id!, 'self_assign', roles)
            }

            return responder.send(message, `**${role.name}** has been set as a self assign role!`, {color: role.hexColor});
        }

        if(remove) {
            if(!hasPerms)
                return responder.fail(message, failMessage);

            if(!roles.includes(role.id))
                return responder.fail(message, 'That is not a valid self assign role');

            const filtered = roles.filter(id => id !== role.id);
            await client.settings.set(message.guild?.id!, 'self_assign', filtered);

            return responder.send(message, `**${role.name}** has been removed as a self assign role!`);
        }

        if(!roles)
            return responder.fail(message, 'no self assign roles have been set for this server!');

        if(!roles.includes(role.id))
            return responder.fail(message, 'that is not a valid self assign role');
        
        const hasRole = message.member?.roles.cache.has(role.id) ? true : false;
        
        !hasRole ? await message.member?.roles.add(role) : await message.member?.roles.remove(role);

        if(replaceState) {
            for(const m_role of message.member?.roles.cache.array()!) {
                if(roles.includes(m_role.id) && m_role.id !== role.id)
                    await message.member?.roles.remove(m_role);
            }
        }        

        responder.send(message, `**${role.name}** has been ${!hasRole ? 'added to you' : 'removed from you'}`, {color: role.hexColor});
    }
}