import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import RedditFetch from '../../services/redditFetch';

export default class Aww extends Command {
    constructor() {
        super('aww', {
            aliases: ['aww', 'cute'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Get a random cute image from reddit.',
        });
    }
    async exec(message: Message) {
        
        const links = [
            'https://reddit.com/r/cats/top.json?sort=top', 
            'https://www.reddit.com/r/catbellies/top.json?sort=top', 
            'https://www.reddit.com/r/catpictures/top.json?sort=top',
            'https://www.reddit.com/r/rarepuppers/top.json?sort=top', 
            'https://www.reddit.com/r/lookatmydog/top.json?sort=top',
            'https://www.reddit.com/r/Rabbits/top.json?sort=top',
        ];

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