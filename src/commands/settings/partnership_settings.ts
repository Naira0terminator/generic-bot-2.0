import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveChannel, resolveMember } from '../../services/utils';

export default class PartnershipSettings extends Command {
    constructor() {
        super('partnersettings', {
            aliases: ['partner-settings', 'ps'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: 'MANAGE_GUILD',
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'channel',
                    match: 'flag',
                    flag: '-channel',
                },
                {
                    id: 'blacklist',
                    match: 'flag',
                    flag: '-blacklist'
                },
                {
                    id: 'args',
                    match: 'rest',
                },
                {
                    id: 'memcount',
                    match: 'flag',
                    flag: '-memcount',
                    
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set'
                }
            ]
        });
    }
    async exec(message: Message, { channel, args, blacklist, memcount, set }: any) {

        if(!args) 
            return responder.fail(message, 'you must provide valid arguments');
        
        if(channel) {
            const ch = resolveChannel(message, args);

            if(!ch)
                return responder.fail(message, 'you must provide a valid channel');

            const data = client.settings.get(message.guild?.id!, 'partner-channel', null);

            if(!data) {
                await client.settings.set(message.guild?.id!, 'partner-channel', ch.id);
            } else {
                client.settings.delete(message.guild?.id!, 'partner-channel');
            }

            return responder.send(message, `${ch} has been set as the partnership channel`);
        }

        if(blacklist) {
            const blacklists = client.settings.get(message.guild?.id!, 'partner-blacklist', null);

            let response = 'the provided server is now blacklisted';

            if(!blacklists) {
                client.settings.set(message.guild?.id!, 'partner-blacklist', [args]);
            }
            else if(blacklists.includes(args)) {
                const filtered = blacklists.filter((e: string) => e !== args);
                client.settings.set(message.guild?.id!, 'partner-blacklist', filtered);

                response = 'the provided server is no longer blacklisted';

            } else {
                blacklists.push(args);
                client.settings.set(message.guild?.id!, 'partner-blacklist', args);
            }

            return responder.send(message, response);
        }

        if(memcount) {
            const intValue = parseInt(args);

            if(!intValue)
                return responder.fail(message, 'that is not a valid number');

            client.settings.set(message.guild?.id!, 'partner-memcount', intValue);

            return responder.send(message, `the partnership requirement has been set to \`${intValue}\` members`);
        }

        if(set) {
            const parsedArgs = args.split(/\s+/g);
            const member     = resolveMember(message, parsedArgs[0]);
            const int        = parseInt(parsedArgs[1]);
            
            if(!member || !int)
                return responder.fail(message, 'you must provide a valid member and a valid number');

            const data = await client.sql.query(`
            INSERT INTO partnerships(member_id, count) VALUES($1, $2)
            ON CONFLICT (member_id) DO UPDATE
            SET member_id = $1, count = $2
            RETURNING count`, [member.id, parsedArgs[1]]);

            return responder.send(message, `${member}'s partnerships have been set to \`${data.rows[0].count}\``);
        }
    }
}