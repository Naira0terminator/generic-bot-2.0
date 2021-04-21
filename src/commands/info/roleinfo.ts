import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import { resolveRole } from '../../services/utils';
import moment from 'moment';

export default class RoleInfo extends Command {
    constructor() {
        super('roleinfo', {
            aliases: ['role-info', 'ri'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets info on a given role or if you input `-m` it gets all the members with the role',
            args: [
                {
                    id: 'r',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'members',
                    match: 'flag',
                    flag: '-m'
                }
            ]
        });
    }
    async exec(message: Message, { r, members }: { r: string, members: string }) {
        if(!r)
            return responder.fail(message, 'you must provide a valid role!');

        const role = resolveRole(message, r);
        if(!role)
            return responder.fail(message, 'Could not resolve the provided role!');
        
        const embed = this.client.util.embed()
            .setColor(role.hexColor === '#000000' ? 'RANDOM' : role.hexColor)
            .setTitle(role.name);
        
        if(members) {
            let mapped = role.members.map(m => m.user).join(' ');

            if(role.members.size > 50)
                mapped = 'Too many members in role';

            embed
                .setDescription(mapped)
                .setFooter(`${role.members.size} members in role!`);
        } else {
            embed
                .setDescription(`
                ● **Members in role** \`${role.members.size}\`
                ● **Created at** \`${moment.utc(role.createdAt).format('dddd, MMMM Do YYYY, HH:mm')}\`
                ● **Hex color** \`${role.hexColor === '#000000' ? 'default color' : role.hexColor}\``)
                .setFooter(`ID: ${role.id}`);
        }

        message.channel.send(embed);
    }
}