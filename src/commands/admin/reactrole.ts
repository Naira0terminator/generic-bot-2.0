import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { unicode } from '../../services/utils';

export default class ReactRole extends Command {
    constructor() {
        super('reactrole', {
            aliases: ['react-role', 'rr'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
            userPermissions: 'MANAGE_ROLES',
            channel: 'guild',
            description: 'Allows you to set react roles. use the command without arguments to check the usage',
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

            await client.settings.delete(message.guild?.id!, `${msg.id}-reactRole`);

            return responder.send(message, 'Reaction roles for that message have been removed');
        }

        if(!msg || !args) {
            return responder.send(message, `
            to set reaction roles on a message you must provide a message id and emotes and roles

            **Example** \`.rr 840209542692470825 | ✅ yes | ❎ no\`

            this will give the member a role called yes if they reacted with ✅ or a role called no if they reacted with ❎
            all arguments must be seperated with a \`|\`
            
            to get message ids you must enable developer mode check this guide here
            [guide on enabling developer](https://github.com/Naira0terminator/generic-bot-2.0/wiki/Enabling-developer-mode)
            
            **Options**
            \`-check\` message id | checks if the provided message id has reaction roles set to it
            \`-remove\` message id | removes the reaction roles from the given message id
            \`-replace\` | when setting up reaction roles if you use this option anywhere in the command it will replace any other roles they have from that reaction role`);
        }

        let obj: any = {};
        // main reason i cached it here instead of resolving it again at the end is so it wouldnt pointlessly have to retrieve it all over again
        let displayCache = [];
        
        for(let element of args) {
            const split = element.trim().split(' ');
            // if given a unicode emoji it will just use the raw argument if given a custom emoji it will parse the id from it and retrieve it from the cache
            let emote: any;
            
            // its a bit messy but you know what it works and idc enough to create a cleaner version
            if(split[0].match(/^<:.+:\d+>$/i))
                emote = client.emojis.cache.get(split[0].slice(split[0].indexOf(':', 2) + 1, -1));
            else if(split[0].match(/^<a:.+:\d+>$/i)) {
                emote = client.emojis.cache.get(split[0].slice(split[0].indexOf(':', 3) + 1, -1));
            }
            else if(split[0].match(unicode))
                emote = split[0];
            else 
                emote = client.emojis.cache.get(split[0]);

            if(!emote)
                return responder.fail(message, `Could not resolve the given emote **${split[0]}** perhaps its invalid!`);

            // gets the rest of the args to resolve the role for spaced roles
            const resolvable = split.slice(1).join(' ').trim();

            const role = 
            message.guild?.roles.cache.get(resolvable) || 
            message.guild?.roles.cache.find(r => r.name.toLowerCase() === resolvable.toLowerCase()) ||
            message.guild?.roles.cache.find(r => r.id === split[1].slice(split[1].indexOf('&') + 1, -1));

            if(!role)
                return responder.fail(message, `**${resolvable}** is not a valid role`);

            obj[emote.id ?? emote] = role.id;
            displayCache.push({emote: emote, role: role});
        }

        // makes sure to react with the corrent roles if it does not already exist on the message
        // this can potentially mess up the order but thats fine
        for(const data of displayCache) {
            if(!msg.reactions.cache.has(data.emote.id))
                await msg.react(data.emote);
        }
        
        const data = {
            data: obj,
            replace: replace ? true : false,
        }
        
        await client.settings.set(message.guild?.id!, `${msg.id}-reactRole`, data);

        responder.send(message, `
        **Reaction role set to** [message](${msg.url})
        
        ${displayCache.map((element: any) => `${element.emote} ${element.role}`).join('\n')}`);
    }
}