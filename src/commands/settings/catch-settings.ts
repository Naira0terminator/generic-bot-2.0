import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveMember, resolveChannel } from '../../services/utils';

// implement option to make it so you can change the spawn chance

export default class catchSettings extends Command {
    constructor() {
        super('catchsettings', {
            aliases: ['catch-setting', 'catch-set'],
            userPermissions: ['MANAGE_GUILD'],
            cooldown: 60000,
            channel: 'guild',
            description: {
                content: 'set the catch settings for the server.\nby default the command will set the channel for the catch event to occure(only one channel per server)\n-toggle will toggle it on and off',
                usage: '<channel>\n-toggle\n-clear <member>'
            },
            args: [
                {
                    id: 'toggle',
                    match: 'flag',
                    flag: '-toggle',
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: '-clear',
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set',
                },
                {
                    id: 'arg',
                },
                {
                    id: 'value',
                },
                {
                    id: 'add',
                    match: 'flag',
                    flag: '-add'
                }
            ],
        });
    }
    async exec(message: Message, { toggle, clear, arg, add, value, set }: any) {

        if(add) {
            const member = resolveMember(message, arg);

            if(!member)
                return responder.fail(message, 'that is not a valid member');

            await client.redis.zincrby(`guild[${message.guild?.id}]-catch`, value, member.id);

            return responder.send(message, `added **${value}**`)
        }

        if(set) {
            const member = resolveMember(message, arg);

            if(!member)
                return responder.fail(message, 'that is not a valid member');

            await client.redis.zadd(`guild[${message.guild?.id}]-catch`, value, member.id);

            return responder.send(message, `added **${value}**`)
        }

        if(toggle) {
            let data = client.settings.get(message.guild?.id!, `catchState`, false);

            data ? client.settings.set(message.guild?.id!, `catchState`, false) : client.settings.set(message.guild?.id!, `catchState`, true)
            
            return responder.send(message, `catch has been set to: \`${data ? 'Enabled' : 'Disabled'}\``);
        }

        if(clear) {
            const member = resolveMember(message, arg);
            await client.redis.zrem(`guild[${message.guild?.id}]-catch`, `${member?.id}`);
            return responder.send(message, `**${member?.user.username}**'s catch Data has been reset!`);
        }

        const ch = arg ? resolveChannel(message, arg) : message.channel;
        if(!ch) 
            return responder.fail(message, 'you must provide a valid channel');

        client.settings.set(message.guild?.id!, 'catchChannel', ch.id);
        client.settings.set(message.guild?.id!, 'catchState', true);

        responder.send(message, `The catch channel has been set to ${ch}`);
    }
}