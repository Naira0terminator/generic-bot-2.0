import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveRole } from '../../services/utils';

export default class AutoRole extends Command {
    constructor() {
        super('autorole', {
            aliases: ['auto-role', 'ar'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
            userPermissions: 'MANAGE_ROLES',
            channel: 'guild',
            description: 'lets you set roles to be added to new members when they join. use the command without arguments to see usage',
            args: [
                {
                    id: 'r',
                    match: 'rest'
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: 'all',
                },
                {
                    id: 'remove',
                    match: 'flag',
                    flag: '-remove',
                }, 
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset',
                }
            ]
        });
    }
    async exec(message: Message, { r, all, remove, reset }: { r: string, all: string, remove: string, reset: string} ) {
        const data = client.settings.get(message.guild?.id!, 'auto-role', null);
        
        if(all) 
            return responder.send(message, !data ? 'No auto roles set' : data.map((id: string) => resolveRole(message, id)).join(' '));
        
        if(reset) {
            await client.settings.delete(message.guild?.id!, 'auto-role');
            return responder.send(message, 'Auto roles have been reset');
        }

        if(!r)
            return responder.send(message, `
            use the command with one or more roles to set them as auto roles and seperate them with a comma
            **Example** \`.ar role 1, role 2, role 3\`
            
            \`-remove\` role | removes the given role as an auto role
            \`all\` | shows all auto roles
            \`-reset\` | resets auto roles`);

        if(remove) {
            const resolved = resolveRole(message, r);

            if(!resolved)
                return responder.fail(message, 'that is not a valid role!');

            const filtered = data.filter((id: string) => id !== resolved.id);
            client.settings.set(message.guild?.id!, 'auto-role', filtered);
            return responder.send(message, `${resolved} will no longer be given to new members when they join`);
        }

        const raw = r.split(/,\s*/);
        let roles: Array<string> = [];

        for(let i = 0; i !== raw.length; i++) {
            const resolved = resolveRole(message, raw[i]);

            if(!resolved)
                continue;

            roles.push(resolved.id);
        }

        if(!data)
            client.settings.set(message.guild?.id!, 'auto-role', roles);
        else {
            data.concat(roles);
            client.settings.set(message.guild?.id!, 'auto-role', data);
        }

        responder.send(message, `the following roles will be given to new members when they join. ${roles.map((id: string) => resolveRole(message, id)).join(' ')}`);
    }
}