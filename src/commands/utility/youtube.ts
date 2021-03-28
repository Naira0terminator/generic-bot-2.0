import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import request from 'node-superfetch';
import { youtubeKey } from '../../config.json';

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

        try {
            const { body }: any = await request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({
                part:'snippet',
                type: 'video',
                maxResults: String(25),
                q: query,
                key: youtubeKey
            });

            if(!body.items.length) 
                return responder.fail(message, 'i could not find any results');

            let item = 0;
            const getVideo = (item: number) => {
                const data = body.items[item];
                const video = `https://www.youtube.com/watch?v=${data.id.videoId}`
                return video;
            }

            const msg = await message.channel.send(getVideo(item));

            await msg.react('⬅️');
            await msg.react('➡️');

            const collector = msg.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60000});

            collector.on('collect', async r => {
                if(r.emoji.name === '➡️') {
                    item++
                    await msg.edit(getVideo(item));
                }
                if(r.emoji.name === '⬅️') {
                    item--
                    await msg.edit(getVideo(item));
                }
                r.users.remove(message.author.id);
            });

            collector.on('end', async () => {
                await msg.reactions.removeAll();
                await msg.edit(`message is now inactive!\n${getVideo(item)}`);
            });
        } catch(err) {
            responder.fail(message, 'there was an error searching for that video!');
        }
    }
}