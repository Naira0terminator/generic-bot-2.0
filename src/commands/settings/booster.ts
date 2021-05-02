import { Command } from 'discord-akairo'; 
import { Message, Role } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveRole } from '../../services/utils';
import { queries } from '../../services/database';

export default class Booster extends Command {
    constructor() {
        super('boosterRole', {
            aliases: ['booster-role', 'br'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'role',
                    type: 'role',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { role }: { role: Role}) {
        
        if(!role) {
            const boosterRole = client.settings.get(message.guild?.id!, queries.settings.boosterRole, null);

            if(!boosterRole)
                return responder.fail(message, 'You must provide a valid role');

            return responder.send(message, `The current booster role is set to ${resolveRole(message, boosterRole)}`)
        }

        client.settings.set(message.guild?.id!, queries.settings.boosterRole, role.id);
        
        responder.send(message, `The booster role has been set to ${role}`);
    }
}