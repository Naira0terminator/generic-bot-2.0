import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import RedditFetch from '../../services/redditFetch';

export default class Meme extends Command {
    constructor() {
        super('meme', {
            aliases: ['meme'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets a random meme from reddit.',
        });
    }
    async exec(message: Message) {
        const links = ['https://www.reddit.com/r/memes/top.json?sort=top', 'https://www.reddit.com/r/dankmemes/top.json?sort=top'];

        const rf = new RedditFetch(links, { limit: 35, time: 'day', sort: 'top'});
        const post = await rf.get();

        await message.channel.send(this.client.util.embed()
        .setURL(post?.permalink!)
        .setTitle(post?.title)
        .setImage(post!.url)
        .setColor('RANDOM')
        .setFooter(`${message.member?.user.username}   | 👍: ${post?.upVotes}   | 💬: ${post?.comments}`, message.author.displayAvatarURL()));
    }
}