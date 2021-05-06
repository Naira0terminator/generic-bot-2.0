import { Command } from 'discord-akairo'; 
import { Message, MessageAttachment } from 'discord.js';
import client from '../..';
import Canvas from 'canvas';
import Img from '../../services/img';
import { join } from 'path';
import { unicode } from '../../services/utils';
import { TextChannel } from 'discord.js';

export default class Ping extends Command {
    constructor() {
        super('test', {
            aliases: ['t1', 'test'],
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: 'MANAGE_GUILD',
            channel: 'guild',
            description: 'a testing command',
            args: [
                {
                    id: 'args',
                    match: 'rest'
                },
            ]
        });
    }
    async exec(message: Message, { args }: { args: string }) {
        
        // const img = new Img(750, 250);

        // await img.load(join(__dirname, '..', '..', 'resources', 'images', 'sky.png'));
        // img.drawRect('black', 0, 0, img.canvas.width, img.canvas.height, {width: 10});
        // img.setText(message.author.tag, 'black', img.canvas.width / 2.5, img.canvas.height / 2.5);
        
        // img.drawCircle(125, 125, 100, 0, Math.PI * 2, {anticlockwise: true, clip: true});
        // await img.load(message.author.displayAvatarURL({format: 'png'}), 25, 25, 200, 200);
        // img.drawCircle(125, 125, 100, 0, Math.PI * 2, {color: 'black', clip: false, width: 10});

        // const attatchment = new MessageAttachment(img.buffer(), 'test.png');
        // message.channel.send(attatchment);
        //message.channel.send(`emote ${args}`);

        // const split = args.split(' ');
        // const channel = message.guild?.channels.cache.get(split[0]) as TextChannel;
        // const msg = await channel.messages.fetch(split[1]);
        // message.channel.send(`name: ${channel.name} | message: ${msg.content}`);

        console.log('========= start =========');

        const index: any = {};

        // {
        //     "guild": {
        //         "channel": ['msg']
        //     }
        // }

        for(const [id, _] of client.settings.items) {
            
            if(!id.match(/^\d+$/))
                continue;

            const guildIDS = Object.entries(client.settings.items.get(id))
            for(const [key, _] of guildIDS) {
                if(!key.endsWith('reactRole'))
                    continue;
                
                if(!index[id])
                    index[id] = {};

                const channelID = key.slice(0, key.indexOf('_'));
                const messageID = key.slice(key.indexOf('_') + 1, key.indexOf('-'));

                if(!index[id][channelID])
                    index[id][channelID] = [];

                index[id][channelID].push(messageID);
            }
        }

        //console.log(index);

       const entries = Object.entries(index);

       for(const [key, value] of entries) {
            const guild = client.guilds.cache.get(key);

            if(!guild)
                continue;

            const cache = [];

            for(const [channelID, msgs] of Object.entries(value as any)) {
                const channel = guild.channels.cache.get(channelID) as TextChannel;
                
                if(!channel)
                    continue;

                for(const id of msgs as Array<string>) {
                    const msg = await channel.messages.fetch(id);

                    if(!msg)
                        continue;
                        
                    cache.push(msg.content);
                }
                console.log(channel.name);
            }
            console.log(cache);
       }
    }
}