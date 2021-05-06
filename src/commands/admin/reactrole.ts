import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveRole, unicode } from '../../services/utils';

export default class ReactRole extends Command {
    constructor() {
        super('reactrole', {
            aliases: ['react-role', 'rr'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
            userPermissions: 'MANAGE_ROLES',
            channel: 'guild',
            description: 'Allows you to set react roles',
            separator: '|',
            args: [
                {
                    id: 'msg',
                    type: 'guildMessage',
                },
                {
                    id: 'args',
                    match: 'separate',
                }, 
                {
                    id: 'replace',
                    match: 'flag',
                    flag: '-replace'
                },
                {
                    id: 'check',
                    match: 'flag',
                    flag: '-check',
                },
                {
                    id: 'remove',
                    match: 'flag',
                    flag: '-remove'
                }
            ]
        });
    }
    async exec(message: Message, { msg, args, replace, check, remove }: { msg: Message, args: string[], replace: string, check: string, remove: string }) {
        
        if(msg && check) {
            const data = client.settings.get(message.guild?.id!, `${msg.id}-reactRole`, null);

            if(!data)
                return responder.fail(message, 'no reaction roles setup for that message');

            return responder.send(message, 'the provided message has reaction roles!');
        }
        
        if(msg && remove) {
            const data = client.settings.get(message.guild?.id!, `${msg.id}-reactRole`, null);

            if(!data)
                return responder.fail(message, 'no reaction roles setup for that message');

            await data.msg.reactions.removeAll();
            await client.settings.delete(message.guild?.id!, `${msg.id}-reactRole`);

            return responder.send(message, 'Reaction roles for that message have been removed');
        }

        if(!msg || !args)
            return responder.fail(message, 'You must provide a valid message id and arguments. **Example** `.rr 839522197228093460 | ✅ yes | ❎ no`');

        let arr: Array<any> = [];

        for(let element of args) {
            const split = element.trim().split(' ');

            const emote = split[0].match(unicode) ? split[0] : client.emojis.cache.get(split[0].slice(split[0].indexOf(':', 2) + 1, -1));
        
            if(!emote)
                return responder.fail(message, `Could not resolve the given emote **${split[0]}** perhaps its invalid!`);

            const resolvable = split.slice(1).join(' ');
            const role = resolveRole(message, resolvable);
            
            if(!role)
                return responder.fail(message, `**${resolvable}** is not a valid role`);

            arr.push({emote: emote, role: role});
        }

        for(const data of arr) {
            if(!msg.reactions.cache.has(data.emote.id))
                msg.react(data.emote);
        }
        
        const data = {
            msg: msg,
            data: arr,
            replace: replace ? true : false,
        }
        
        await client.settings.set(message.guild?.id!, `${msg.channel.id}_${msg.id}-reactRole`, data);

        responder.send(message, `
        **Reaction role set to** [message](${msg.url})
        
        ${arr.map((element: any) => `${element.emote} ${element.role}`).join('\n')}`);
    }
}