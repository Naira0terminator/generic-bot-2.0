import { Command } from 'discord-akairo'; 
import { Message, MessageAttachment } from 'discord.js';
import client from '../..';
import Canvas from 'canvas';
import Img from '../../services/img';
import { join } from 'path';

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
                    id: 'color',
                },
                {
                    id: 'value',
                    match: 'rest'
                }
            ]
        });
    }
    async exec(message: Message, { color, value }: any) {
        
        const img = new Img(750, 250);

        await img.load(join(__dirname, '..', '..', 'resources', 'images', 'sky.png'));
        img.drawRect('black', 0, 0, img.canvas.width, img.canvas.height, {width: 10});
        img.setText(message.author.tag, 'black', img.canvas.width / 2.5, img.canvas.height / 2.5);
        
        img.drawCircle(125, 125, 100, 0, Math.PI * 2, {anticlockwise: true, clip: true});
        await img.load(message.author.displayAvatarURL({format: 'png'}), 25, 25, 200, 200);
        img.drawCircle(125, 125, 100, 0, Math.PI * 2, {color: 'black', clip: false, width: 10});

        const attatchment = new MessageAttachment(img.buffer(), 'test.png');
        message.channel.send(attatchment);
    }
}