import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class Say extends Command {
    constructor() {
        super('say', {
            aliases: ['say', 's'],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Makes the bot echo the provided args. use \`-e\` to make the response into an embed and \`-owo\` to owoify the response.',
            args: [
                {
                    id: 'embed',
                    match: 'flag',
                    flag: '-e',
                },
                {
                    id: 'owo',
                    match: 'flag',
                    flag: '-owo'
                },
                {
                    id: 'say',
                    match: 'rest'
                },
            ],
        });
    }
    async exec(message: Message, { embed, owo, say}: Record<string, string>) {
        
        if(!say)
            return responder.fail(message, 'say what?');

        await message.delete();

        if(owo) {
            say = say.replace(/(?:l|r)/g, 'w')
            .replace(/(?:L|R)/g, 'W')
            .replace(/(?:L|R)/g, 'W')
            .replace(/n([aeiou])/g, 'ny$1')
            .replace(/N([aeiou])|N([AEIOU])/g, 'Ny$1')
            .replace(/ove/g, 'uv')
            .replace(/nd(?= |$)/g, 'ndo')
          
            return message.channel.send(say);
        }

        if(embed) {
            return message.channel.send(this.client.util.embed()
            .setAuthor(`from ${message.author.username}`, message.author.displayAvatarURL())
            .setDescription(say)
            .setColor('RANDOM'));
        }

        message.channel.send(say);
    }
}