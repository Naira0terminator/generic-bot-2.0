import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveMember, resolveRole } from '../../services/utils';

export default class Name extends Command {
    constructor() {
        super('emojirestrict', {
            aliases: ['emoji-restrict', 'er'],
            cooldown: 3000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_EMOJIS'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'r',
                    match: 'flag',
                    flag: '-role'
                },
                {
                    id: 'resolvable',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { r, resolvable }: { r: string, resolvable: string }) {
        
        if(r) {
            const role = resolveRole(message, resolvable);

            if(!role)
                return responder.fail(message, 'that is not a valid role');

            const restrictRole = client.settings.get(message.guild?.id!, 'emoji_restrict_role', null);

            let response = `Members with ${role} will now have their message emojis deleted!`;
            if(restrictRole) {
                client.settings.delete(message.guild?.id!, 'emoji_restrict_role');
                response = `${role} has been removed as an emoji restricted role`;
            }
            else
                client.settings.set(message.guild?.id!, 'emoji_restrict_role', role.id);
            
            return responder.send(message, response);
        }

        const member = resolveMember(message, resolvable);

        if(!member)
            return responder.fail(message, 'that is not a valid member');

        const members = client.settings.get(message.guild?.id!, 'emoji_restrict_members', null);

        let response = `${member} will now have their message emojis deleted!`;

        if(!members)
            client.settings.set(message.guild?.id!, 'emoji_restrict_members', [member.id]);
        else if(members.includes(member.id)) {

            const filtered = members.filter((id: string) => id !== member.id);
            client.settings.set(message.guild?.id!, 'emoji_restrict_members', filtered);

            response = `${member} is no longer emoji restricted!`;
        }
        else {
            members.push(member.id);
            client.settings.set(message.guild?.id!, 'emoji_restrict_members', members);
        }
        
        return responder.send(message, response);
       
    }
}