import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import moment from 'moment';

export default class Snipe extends Command {
    constructor() {
        super('snipe', {
            aliases: ['snipe'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            lock: 'channel',
            description: 'gets the last deleted message in the channel. use `-e` to get the last edited message',
            args: [
                {
                    id: 'e',
                    match: 'flag',
                    flag: '-e'
                }
            ]
        });
    }
    async exec(message: Message, { e }: { e: string }) {
        const cache = client.snipeCache.get(e ? `edit-${message.channel.id}` : message.channel.id);
        
        if(!cache)
            return responder.fail(message, 'there is nothing to snipe right now!');

        const embed = this.client.util.embed()
            .setAuthor(cache.author.username, cache.author.displayAvatarURL())
            .setColor('RANDOM')
            .setDescription(e ? `old: ${cache.old}\nnew: ${cache.new}` : cache.msg.content)
            .setFooter(e ? '' : `Deleted ${moment(cache.msg.createdAt).fromNow()} ago`);

        if(!e && cache.attatchments)
            embed.setImage(cache.attatchments);

        message.channel.send(embed);
    }
}