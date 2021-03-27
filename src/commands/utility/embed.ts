import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import Responder from '../../services/responder';

export default class Embed extends Command {
    constructor() {
        super('embed', {
            aliases: ['embed'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'raw',
                    type: 'string',
                    match: 'rest',
                }
            ]
        });
    }
    async exec(message: Message, { raw }: { raw: string }) {

        if(!raw)
            return Responder.fail(message, 'you must provde a valid embed syntax');
            
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

        for(const element of arr) {
            const key = element.slice(0, element.indexOf(':')).toLowerCase().trim();
            const value = element.slice(element.indexOf(':') + 1).trim();

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

        message.channel.send({embed: constructor});
    }
}