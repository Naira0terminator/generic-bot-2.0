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
            clientPermissions: ['SEND_MESSAGES'],
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
                }
            ]
        });
    }
    async exec(message: Message, { r, set, remove, all }: any) {
        
        const roles: Array<string> = await client.settings.get(message.guild?.id!, 'self_assign', null);
        const hasPerms = message.member?.permissions.has('MANAGE_ROLES') ? true : false;
        const failMessage = 'You must have manage roles perms to add self assign roles';

        if(all) {
            return responder.send(message, roles.map(id => resolveRole(message, id)).join(', '));
        }

        if(!r) {
            return responder.send(message, `
            to assing a role (as long as its been set as a self assign role) use the command with the desired role
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
            else 
                roles.push(role.id);

            return responder.send(message, `**${role.name}** has been set as a self assign role!`);
        }

        if(remove) {
            if(!hasPerms)
                return responder.fail(message, failMessage);

            const filtered = roles.filter(id => id !== role.id);
            await client.settings.set(message.guild?.id!, 'self_assign', filtered);

            return responder.send(message, `**${role.name}** has been removed as a self assign role!`);
        }

        if(!roles.includes(role.id))
            return responder.fail(message, 'that is not a valid self assign role');
        
        const hasRole = message.member?.roles.cache.has(role.id) ? true : false;
        !hasRole ? await message.member?.roles.add(role) : await message.member?.roles.remove(role);

        responder.send(message, `**${role.name}** has been ${!hasRole ? 'added to you' : 'removed from you'}`, {color: role.hexColor});
    }
}