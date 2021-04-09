import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../../index';
import ms from 'ms';
import Responder from '../../services/responder';

export default class Poll extends Command {
    constructor() {
        super('poll', {
            aliases: ['poll'],
            cooldown: 30000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content: 'creates a poll',
                usage: '<question>, <time>',
                examples: ['should i do this thing, 30 seconds']
            },
            separator: ',',
            args: [
                {
                    id: 'args',
                    match: 'separate'
                },
            ]
        });
    }
    async exec(message: Message, { args }: { args: string[] }) {

        if(!args)
            return Responder.fail(message, 'You must provide both a question and a time and seperate them with a comma. **Example** `.poll should i ban you, 30 seconds`');

        const question = args[0];
        const time = args[1];

        const embed = client.util.embed()
        .setAuthor(`Created by ${message.author.username}`, message.author.displayAvatarURL())
        .setDescription(question.endsWith('?') ? question : question+'?')
        .setColor('RANDOM')
        .setFooter(`Time: ${ms(ms(time), {long: true})}`);

        const msg = await message.channel.send(embed);

        await msg.react('✅');
        await msg.react('❌');

        setTimeout(async () => {
            const arr = msg.reactions.cache.array().sort((a, b) => b.users.cache.size - a.users.cache.size);
            let result = `Times up the answer was ${arr[0]?.emoji} with ${arr[0]?.users.cache.size} reactions`;

            if(arr[0].users.cache.size === arr[1].users.cache.size)
                result = `it was a tie with ${arr[0]?.users.cache.size} reactions`;

            await msg.edit(embed.setFooter(`Times up the answer was ${result}`));
            await msg.reactions.removeAll();
        }, ms(time));
    }
}