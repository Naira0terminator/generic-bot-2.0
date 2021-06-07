import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import request from 'node-superfetch';
import { youtubeKey } from '../../config.json';
import { paginate } from '../../services/pagination';

export default class Youtube extends Command {
    constructor() {
        super('youtube', {
            aliases: ['youtube', 'yt'],
            cooldown: 15000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'searches for a  video on youtube',
            args: [
                {
                    id: 'query',
                    type: 'string',
                    match: 'rest',
                },
            ],
        });
    }
    async exec(message: Message, { query }: { query: string }) {
        
        if(!query) 
            return responder.fail(message, 'you must provide a search term!');

        const { body }: any = await request
        .get('https://www.googleapis.com/youtube/v3/search')
        .query({
            part:'snippet',
            type: 'video',
            maxResults: "25",
            q: query,
            key: youtubeKey
        });

        if(!body.items.length) 
            return responder.fail(message, 'i could not find any results');


        const getVideo = (item: number) => {
            const data = body.items[item];
            return `https://www.youtube.com/watch?v=${data.id.videoId}`
        }
        
        await paginate(message, 1, getVideo);
    }
}