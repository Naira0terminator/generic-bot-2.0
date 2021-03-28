import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import { googleKey } from '../../config.json';
import fetch from 'node-superfetch';

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
            num: String(10),
            safe: 'active',
            searchType: 'image',
            key: googleKey,
            cx: '000606063932237113240:q-nv8rtizca',
        });

        let item = 0;
        let client = this.client;
        let forward = '➡️'
        let backward = '⬅️'

        const msg = await message.channel.send(constructEmbed(item));
        await msg.react(backward);
        await msg.react(forward);

        const collector = msg.createReactionCollector((r, u) => [forward, backward].includes(r.emoji.name) && u.id === message.author.id, {time: 60000});

        collector.on('collect', async r => {
            if(r.emoji.name === forward) {
                item++;
                await msg.edit(constructEmbed(item));
            }
            if(r.emoji.name === backward) {
                item--;
                await msg.edit(constructEmbed(item));
            }

            r.users.remove(message.author.id);
        });

        collector.on('end', async () => {
            await msg.reactions.removeAll();
            await msg.edit('message is now inactive!');
        });

        function constructEmbed(item: number) {
            const data = body.items[item];
            const embed = client.util.embed()
            .setTitle(data.title)
            .setDescription(`[Link](${data.link})`)
            .setImage(data.link)
            .setColor('RANDOM')
            return embed;
        }
    }
}