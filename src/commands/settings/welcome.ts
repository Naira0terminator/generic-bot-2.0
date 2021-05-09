import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { resolveChannel } from '../../services/utils';

export default class Welcome extends Command {
    constructor() {
        super('welcome', {
            aliases: ['welcome'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: 'MANAGE_GUILD',
            channel: 'guild',
            description: 'sends a specified message to a specified channel. use the command without args to see usage',
            args: [
                {
                    id: 'args',
                    match: 'rest'
                },
                {
                    id: 'embed',
                    match: 'flag',
                    flag: '-embed'
                },
                {
                    id: 'test',
                    match: 'flag',
                    flag: '-test',
                },
                {
                    id: 'edit',
                    match: 'flag',
                    flag: '-edit',
                },
                {
                    id: 'reset',
                    match: 'flag',
                    flag: '-reset'
                }
            ]
        });
    }
    async exec(message: Message, { args, embed, test, edit, reset }: any) {
        
        if(test) {
            return client.emit('guildMemberAdd', message.member!);
        }

        if(reset) {
            client.settings.delete(message.guild?.id!, 'welcome');
            return responder.send(message, 'welcome settings have been reset');
        }

        if(!args)
            return responder.send(message, `
            provide a channel and then a message or embed id
            **Example** \`.welcome #channel {memberName} has joined the server!\`
            
            the command works with variables see [variable guide](https://github.com/Naira0terminator/generic-bot-2.0/wiki/variables) for more 
            
            **options**
            \`-embed\` embed id | use this and provide an embed id instead of a message and it will set that embed as the welcome message
            see the embed command for more info
            
            \`-edit\` | if this option is provided when using the command it will make it so that the welcome message will get edited to the user has left when the member leaves
            
            \`-reset\` | resets welcome data
            
            \`-test\` | simulates a new member joining to test the welcome message`);

        const parsed: Array<string> = args.split(/\s+/g);  

        // if no embed flag is provided it will parse the rest otherwise it will be null for embed to resasign it
        let msg: any = !embed ? parsed.slice(1).join(' ') : null;

        if(embed) {
            const resolveEmbed = client.settings.get(message.author.id, parsed.slice(1).join(' '), null);

            if(!resolveEmbed)
                return responder.fail(message, 'that is not a valid embed id.');

            msg = resolveEmbed;
        }

        const channel = resolveChannel(message, parsed[0]);

        if(!channel || channel.type !== 'text')
            return responder.fail(message, 'you must provide a valid channel');

        const data = {
            content: msg,
            channel: channel.id,
            edit: edit ? true : false,
        }

        await client.settings.set(message.guild?.id!, 'welcome', data);

        responder.send(message, `welcome channel set to ${channel}. to test the message use the command with \`-test\` argument`);
    }
}