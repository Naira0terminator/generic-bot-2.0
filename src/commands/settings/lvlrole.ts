import { Command, Argument } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../../index';
import responder from '../../services/responder';
import { resolveRole } from '../../services/utils';

export default class Name extends Command {
    constructor() {
        super('lvlrole', {
            aliases: ['level-role', 'lrole'],
            channel: 'guild',
            lock: 'guild',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'level',
                },
                {
                    id: 'role',
                    type: Argument.compose('lowercase'),
                    match: 'rest',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all',
                },
                {
                    id: 'reward',
                    match: 'flag',
                    flag: '-reward',
                }, 
            ],
        });
    }
    async exec(message: Message, {level, role, all , reward}: {level: string, role: string, all: string, reward: string}) {

        // very messy code but you know what its good enough
        // gets the level roles from redis and turns it into an array it then checks if the array is not empty it will map them if it is it will give a text response 
        if(all) {
            const embed = this.client.util.embed();

            const getRoles = await client.redis.hgetall(`guild[${message.guild?.id}]-exp-levelRoles`);
            const roleEntries = Object.entries(getRoles);            
            embed.setColor('RANDOM')
            embed.addField('Level roles', roleEntries.length ? 
                Object.entries(getRoles)
                .filter(role => message.guild?.roles.cache.has(role[1]))
                .map(key => {
                    const getRole = message.guild?.roles.cache.get(key[1]);
                    return `${key[0]}: ${getRole}\n`;
                }) : 'No level roles set'
            );

            const rewards = await client.redis.hgetall(`guild[${message.guild?.id}]-exp-reward`);
            const rewardEntries = Object.entries(rewards);

            if(rewardEntries.length) {
                embed.addField('Reward roles', rewardEntries.length ?
                rewardEntries.filter(role => message.guild?.roles.cache.has(role[1]))
                .map(key => {
                    return `${key[0]}: ${resolveRole(message, key[1])}\n`;
                }) : 'No rewards roles set');
            }

            return message.channel.send(embed);
        }

        if(!level)
            return responder.fail(message, 'you must provide a valid level');

        if(isNaN(Number(level)))
            return responder.fail(message, 'you must provide a valid number for the level');
        
        const removeifExists = async (type: string): Promise<boolean> => {
            if(!role) {
                if(await client.redis.hexists(`guild[${message.guild?.id}]-exp-${type}`, level)) {
                    await client.redis.hdel(`guild[${message.guild?.id}]-exp-${type}`, level);
                    return true;
                }
            }
            return false;
        }

        if(await removeifExists('levelRoles') || await removeifExists('reward')) 
            return responder.send(message, `The level/reward role for **${level}** has been reset`);

        const resRole = resolveRole(message, role);
        if(!resRole)
            return responder.fail(message, 'That is not a valid role');

        if(reward) {
            await client.redis.hset(`guild[${message.guild?.id}]-exp-reward`, level, resRole.id);
            return responder.send(message, `Members with level **${level}** will now recieve ${resRole} as a reward role`);
        }

        await client.redis.hset(`guild[${message.guild?.id}]-exp-levelRoles`, level, resRole.id);
        return responder.send(message, `Members with level **${level}** will now recieve ${resRole}`);
    }
}