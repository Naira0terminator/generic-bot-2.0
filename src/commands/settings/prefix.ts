import { Command, Argument } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
//import prefix from '../../models/prefix';
import config from '../../config.json';
import client from '../..';
import { queries } from '../../services/database';

export default class Prefix extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['ADMINISTRATOR'],
            channel: 'guild',
            description: 'Set a new prefix for the guild or view the current one',
            args: [
                {
                    id: 'value',
                    //type: Argument.validate('string', (m: Message, p: string, str: string) => str.length > 8),
                }
            ]
        });
    }
    async exec(message: Message, { value }: { value: string }) {
        
        // Sequelize prefix code

        // const getPrefix = await prefix.findByPk(message.guild?.id);

        // if(!value) {
        //     return responder.success(message, `Prefix: \`${getPrefix?.get('prefix') ?? config.prefix}\``)
        // }

        // if(!getPrefix) {
        //     await prefix.create({
        //         guild: message.guild?.id,
        //         prefix: value,
        //     });

        //     return responder.success(message, `prefix set to \`${value}\``);
        // }

        // await prefix.update({
        //     prefix: value
        // }, {where: {guild: message.guild?.id}});

        // responder.success(message, `Prefix updated to: \`${value}\``);

        // Sequelize provider prefix code

        if(!value) {
            const prefix = await client.settings.get(message.guild?.id!, queries.settings.prefix, config.prefix);
            return responder.send(message, `Prefix: \`${prefix}\``);
        }

        await client.settings.set(message.guild?.id!, queries.settings.prefix, value);
        responder.send(message, `Prefix set to \`${value}\``);
    }
}