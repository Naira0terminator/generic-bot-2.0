import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import translate from '@vitalets/google-translate-api/index';

export default class Translate extends Command {
    constructor() {
        super('translate', {
            aliases: ['translate', 'trans'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content: 'translates the given text to the desired language.',
                usage: '<from> <to>',
                examples: ['en es hi there', 'english spanish hi there'],
            },
            args: [
                {
                    id: 'from',
                },
                {
                    id: 'to'
                },
                {
                    id: 'text',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { from, to, text }: { from: string, to: string, text: string}) {

        if(!from || !to) 
            return responder.fail(message, 'you must provide a from and to language. example: `,translate spanish english hola`');

        if(text.length > 350)
            return responder.fail(message, 'your translation text cannot be longer then 350 characters');

        if(!translate.languages.isSupported(from) || !translate.languages.isSupported(to))
            return responder.fail(message, 'That is not a supported language');

        const translation = await translate(text, {from: from, to: to});

        const langs: any = translate.languages;

        message.channel.send(this.client.util.embed()
            .setTitle(`${from.length > 2 ? from : langs[from]} => ${to.length > 2 ? to : langs[to]}`) 
            .setDescription(translation.text)
            .setColor('RANDOM'));
    }
}