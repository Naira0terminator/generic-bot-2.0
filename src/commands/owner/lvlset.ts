import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Name extends Command {
    constructor() {
        super('lvlset', {
            aliases: ['level-set', 'lset', 'lvl-set'],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'member',
                    type: 'member',
                },
                {
                    id: 'target',
                },
                {
                    id: 'exp',
                    match: 'flag',
                    flag: '-exp'
                }
            ]
        });
    }
    async exec(message: Message, { member, target, exp}: {member: GuildMember, target: number, exp: string}) {
        
        if(!member || !target)
            return responder.fail(message, 'You must provide a valid member and a target');

        if(exp) {
            await client.leveler.addExp(member, target);
            return responder.send(message, `**${member.user.username}**'s exp has been set to ${target}`) 
        }

        await client.leveler.setLevel(member, target);
        responder.send(message, `**${member.user.username}**'s level has been set to ${target}`);
    }
}