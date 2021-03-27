import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { includesOne } from '../../services/utils';
import { queries } from '../../services/database';

// TODO: add a flag that lets boosters update their booster role.

export default class Boost extends Command {
    constructor() {
        super('boost', {
            aliases: ['boost'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'A command for boosters to retrieve their perms',
            separator: ',',
            args: [
                {
                    id: 'details',
                    type: 'string',
                    match: 'separate'
                }
            ]
        });
    }
    async exec(message: Message, { details }: { details: string[]}) {
        
        const isBooster = client.settings.get(message.guild?.id!, queries.settings.boosterRole, null);
        const exists = client.settings.get(message.guild?.id!, queries.settings.MemberBoosterRole(message.author.id), null);

        if(!message.member?.roles.cache.has(isBooster))
            return responder.fail(message, 'Only boosters can use this command');
        
        if(exists) 
            return responder.fail(message, 'You already have a booster role');

        if(!details || details.length != 2)
            return responder.fail(message, `you must provide role name and role color.\nseperate the role name and role color with a comma. the color can also be either a simple color name like blue or a hex color for less basic colors use a hex code.\nExample: \`,boost my booster role, #209CEE\``);
        
        const boosterRole = message.guild?.roles.cache.get(isBooster);
        if(!boosterRole)
            return responder.fail(message, 'No booster role has been set for this server');

        if(details[1].match(/[a-z]+/i)) 
            details[1] = details[1].toUpperCase();

        else if(!details[1].match(/^#.{6}/))
            return responder.fail(message, 'The provided color must have a valid hex code or be a simple color like blue or red');
        
        const filter = (message: Message) => includesOne(message.content, ['yes', 'no']);
        const collector = message.channel.createMessageCollector(filter, {time: 35000});

        message.reply(`is this ok? answer with ("yes" or "no")\n**Role name** \`${details[0]}\` **Role Color** \`${details[1]}\``);

        collector.once('collect', async (collected: Message) => {
            if(collected.content.toLowerCase() === 'yes') {

                let role = await message.guild?.roles.create({
                    data: {
                        name: details[0],
                        color: details[1],
                        position: boosterRole?.rawPosition - 1
                    },
                    reason: `Booster role for ${message.author.tag} (${message.author.id})`
                }).catch(() => null)
                
                if(!role)
                    return responder.fail(message, `Unable to create role`);

                await message.member?.roles.add(role);

                client.settings.set(message.guild?.id!, queries.settings.MemberBoosterRole(message.author.id), role.id);

                return responder.send(message, 'Your custom booster role has been made and given to you');
            }

            if(collected.content.toLowerCase() === 'no')
                return responder.fail(message, 'The command has been cancelled use the command to try again.');
        });
    }
}