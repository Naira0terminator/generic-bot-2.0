import { Command } from 'discord-akairo'; 
import { Message, Role } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveRole } from '../../services/utils';

export default class RoleManager extends Command {
    constructor() {
        super('rm', {
            aliases: ['role-manager', 'rm'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'lets you manage server roles. use the command without any arguments for more info',
            lock: 'guild',
            separator: ',',
            args: [
                {
                    id: 'values',
                    match: 'separate',
                    type: 'string',
                },
                {
                    id: 'c',
                    match: 'flag',
                    flag: '-c',
                },
                {
                    id: 'h',
                    match: 'flag',
                    flag: '-h',
                },
                {
                    id: 'm',
                    match: 'flag',
                    flag: '-m',
                },
                {
                    id: 'n',
                    match: 'flag',
                    flag: '-n',
                }
            ],
        });
    }
    async exec(message: Message, { values, c, h, m, n }: any) {
        if(!values) 
            return message.channel.send(this.client.util.embed()
            .setTitle('Role Manager options')
            .setDescription(
                `to change a role use the command with one of the following flags and arguments.

                **NOTE: be sure to seperate the role and value with a comma.**

                \`-c\` **role, color (hex or color name)** | changes role color
                \`-n\` **role, role name** | changes a roles name
                \`-h\` | hoists or dehoists a role
                \`-m\` | sets a role to be mentionabale or unmentionable`)
            .setColor('RANDOM'));

        let role: string | Role = values[0], value: string = values[1];

        role = resolveRole(message, String(role))!;

        if(c) {
            try {
                console.log(value)
                if(value.match(/[a-z]+/) && !value.startsWith('#')) 
                    value = '#' + value;

                role.setColor(value.match(/[a-z]+/) ? value.toUpperCase() : value);

                return message.reply(`**${role.name}**'s color has been changed to \`${role.hexColor}\``);

            } catch(err) {
                console.log(err);
                return message.reply(`could not change role! ${err}`);
            }
        }

        if(h) {
            try {
                let isHoisted: boolean = false;

                if(role.hoist) isHoisted = false;
                if(!role.hoist) isHoisted = true;

                role.setHoist(isHoisted);
                return message.reply(`**${role.name}** has been set to \`${isHoisted ? 'hoisted' : 'not hoisted'}\``);

            } catch(err) {
                return message.reply(`i could not set that role to be hoisted! ${err}`);
            }
        }

        if(m) {
            try {
               let isMentionable: boolean = false;
               
               if(role.mentionable) isMentionable = false;
               if(!role.mentionable) isMentionable = true;

               role.setMentionable(isMentionable);
               return message.reply(`**${role.name}** has been set to \`${isMentionable ? 'mentionable' : 'UnMentionable'}\``)
            } catch(err) {
                return message.reply(`i could not set that role to be mentionable! ${err}`);
            }
        }

        if(n) {
            try {
                role.setName(value);
                return message.reply(`**${role.name}**'s name has been changed to \`${value}\``);
            } catch(err) {
                return message.reply(`there was an error changing that roles name! ${err}`);
            }
        }
    }
}