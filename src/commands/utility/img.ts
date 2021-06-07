import { Command } from 'discord-akairo'; 
import { Message, MessageEmbed } from 'discord.js';
import { googleKey } from '../../config.json';
import fetch from 'node-superfetch';
import Responder from '../../services/responder';
import { paginate } from '../../services/pagination';

export default class Img extends Command {
    constructor() {
        super('img', {
            aliases: ['image-search', 'img'],
            cooldown: 15000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content: 'does an image search with slides.',
                usage: '<search term>',
                examples: ['cats', 'a really cool picture']
            },
            args: [
                {
                    id: 'search',
                    type: 'string',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message: Message, { search }: { search: string }) {

        const { body }: any = await fetch
        .get('https://customsearch.googleapis.com/customsearch/v1')
        .query({
            q: search,
            num: "10",
            safe: 'active',
            searchType: 'image',
            key: googleKey,
            cx: '000606063932237113240:q-nv8rtizca',
        });

        if(!body)
            return Responder.fail(message, 'Could not find any search results.');
       
        const getImg = (item: number) => {
            const data = body.items[item];
            return new MessageEmbed()
                .setTitle(data.title)
                .setDescription(`[Link](${data.link})`)
                .setImage(data.link)
                .setColor('RANDOM');
        }

        await paginate(message, 1, getImg);
    }
}