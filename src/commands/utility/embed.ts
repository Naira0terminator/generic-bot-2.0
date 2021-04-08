import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../..';
import Responder from '../../services/responder';

export default class Embed extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'allows you to build advanced or simple custom embeds and even save and retrieve them. use the command without args to see options or use the command with `refrence` on a guide to see how to build embeds',
            args: [
                {
                    id: 'raw',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'get',
                    match: 'flag',
                    flag: 'get',
                }, 
                {
                    id: 'all',
                    match: 'flag',
                    flag: 'all'
                },
                {
                    id: 'del',
                    match: 'flag',
                    flag: 'delete'
                },
                {
                    id: 'f_raw',
                    match: 'flag',
                    flag: '-raw'
                },
                {
                    id: 'ref',
                    match: 'flag',
                    flag: 'reference'
                }
            ]
        });
    }
    async exec(message: Message, { raw, get, all, del, f_raw }: { raw: string, get: string, all: string, del: string, f_raw: string }) {

        if(all) {
            const entries = Object.keys(client.settings.items.get(message.author.id));
            Responder.send(message, entries.filter(v => v !== '').join(', '));
            return console.log(client.settings.items.get(message.author.id))
        }

        if(!raw) {
            return message.channel.send(this.client.util.embed()
            .setDescription(`
            [guide on building a custom embed](https://github.com/Naira0terminator/generic-bot-2.0/wiki/Embed-builder-guide)\n
            use the command with one of the following arguments to perform special actions 
            **Example** \`.embed get myEmbed\`\n
            \`-raw\` JSON object | allows you to use a raw json object to build an embed see the link above for more info
            \`get\` id | retrieves an embed using its given id. check the above link to see how to save embeds
            \`all\` | gets all the ids of your saved embeds
            \`delete\`id | deletes a saved embed by its id`)
            .setColor('RANDOM'))
        }

        if(get) {
            const data = client.settings.get(message.author.id, raw, null);

            if(!data)
                return Responder.fail(message, 'could not retrieve embed');

            return message.channel.send({embed: data});
        }

        if(f_raw) {
            const parsed = JSON.parse(raw);

            if('id' in parsed) {
                const id = parsed.id
                delete parsed.id;
                await client.settings.set(message.author.id, id, parsed);
            }

            return message.channel.send({embed: parsed});
        }
        
        if(del) {
            await client.settings.delete(message.author.id, raw);
            return Responder.send(message, `Entery was removed`);
        }

        let constructor: any = {
            type: 'rich',
            title: null,
            description: null,
            color: null,
            timestamp: null,
            fields: [],
            url: null,
            thumbnail: {
                url: null
            },
            image: {
                url: null,
            },
            author: {
                name: null,
                icon_url: null,
                url: null,
            },
            footer: {
                text: null,
                icon_url: null,
            }
        }

        const arr = raw.trim().split(/",?\s*/gi).filter((v, i) => v !== '');

        let saved = {
            saved: false,
            id: '',
        };

        for(const element of arr) {
            let key = element.slice(0, element.indexOf(':')).toLowerCase().trim();
            let value = element.slice(element.indexOf(':') + 1).trim();
            
            if(key === 'color')
                value = value.toUpperCase();

            if(key === 'id') {
                saved.saved = true;
                saved.id = value;
            }
            
            if(key in constructor) {
                const obj = constructor[key];

                if(typeof obj === 'object' && obj && !Array.isArray(obj)) {
                    for(const [k,v] of Object.entries(obj)) {
                        constructor[key][k] = value;
                        break;
                    }
                    continue;
                }
                constructor[key] = value;
            }
        }

        if(saved) 
            await client.settings.set(message.author.id, saved.id, constructor);

        message.channel.send({embed: constructor});
    }
}