import { Command, Argument } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../../index';
import { resolveChannel, resolveRole } from '../../services/utils';
import responder from '../../services/responder';

export default class LvlBlacklist extends Command {
    constructor() {
        super('lvlblacklist', {
            aliases: ['level-blacklist', 'lblacklist', 'lbl'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild',
            description: 'Sets role and channel blacklists',
            args: [
                {
                    id: 'type',
                    type: Argument.compose('lowercase')
                },
                {
                    id: 'object',
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all'
                }
            ]
        });
    }
    async exec(message: Message, {type, object, all}: any) {

        if(all) {
            const channelbl = await client.redis.smembers(`guild[${message.guild?.id}]-exp-blacklist-channel`);
            const rolebl = await client.redis.smembers(`guild[${message.guild?.id}]-exp-blacklist-role`);

            if(!channelbl && !rolebl) 
                return responder.fail(message, 'there are no blacklists for this server!');

            let response = '';

            if(channelbl.length) response += `**Channel**\n${channelbl
            .filter(channel => message.guild?.channels.cache.has(channel))
            .map(channel => {
                const getChannel = message.guild?.channels.cache.get(channel);
                return `${getChannel}`;
            })}`;

            if(rolebl.length) response += `\n**Role**\n${rolebl
            .filter(role => message.guild?.roles.cache.has(role))
            .map(role => {
                const getRole = message.guild?.roles.cache.get(role);
                return `${getRole}`;
            })}`;

            return message.channel.send(this.client.util.embed()
            .setTitle('Level blacklists')
            .setColor('RANDOM')
            .setDescription(response));
        }

        if(!type || !object)
            return responder.fail(message, 'You must provide a valid blacklist type (channel | role) and a valid channel/role');
        
        if(type === 'channel') {
             const channel = resolveChannel(message, object);

             if(!channel) 
                return responder.fail(message, 'that is not a valid channel');

                if(await client.redis.sismember(`guild[${message.guild?.id}]-exp-blacklist-channel`, channel.id)) {
                    await client.redis.srem(`guild[${message.guild?.id}]-exp-blacklist-channel`, channel.id);
                    return responder.send(message, `**${channel}** Has been removed from the blacklist!`)
                }

            await client.redis.sadd(`guild[${message.guild?.id}]-exp-blacklist-channel`, channel.id);
            return responder.send(message, `${channel} has been blacklisted from the EXP system`);
        }

        if(type === 'role') {
            const role = resolveRole(message, object);

            if(!role)
                return responder.fail(message, 'that is not a valid role');

            if(await client.redis.sismember(`guild[${message.guild?.id}]-exp-blacklist-role`, role?.id)) {
                await client.redis.srem(`guild[${message.guild?.id}]-exp-blacklist-role`, role?.id);
                return responder.send(message, `**${role?.name}** Has been removed from the blacklist!`)
            }

            await client.redis.sadd(`guild[${message.guild?.id}]-exp-blacklist-role`, role?.id);
            return responder.send(message, `Members with the **${role?.name}** role will no longer earn exp!`);
        }

        responder.fail(message, 'That is not a valid channel type')
    }
}