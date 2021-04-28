import { Command } from 'discord-akairo'; 
import { Message, GuildMember, MessageAttachment } from 'discord.js';
import Jimp from 'jimp';
import imgType from 'jimp/types';
import Responder from '../../services/responder';
import { resolveMember, random } from '../../services/utils';

export default class Color extends Command {
    constructor() {
        super('color', {
            aliases: ['color'],
            cooldown: 12000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: {
                content: 'generates an image based on your color role or a given a hex color or a given members hex color or just write random to get a random color',
                examples: ['#3498db', '', '@someMember', 'random'],
                usage: '<hex color> <member>'
            },
            args: [
                {
                    id: 'hex',
                    type: 'string'
                },
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                },
                {
                    id: 'random',
                    match: 'flag',
                    flag: 'random'
                }
            ]
        });
    }
    async exec(message: Message, { hex, member, random }: { hex: any, member: GuildMember, random: string}) {
        
        const resolveColor = () => {
            if(!member && !hex)
                return message.member?.displayHexColor;
            else if(hex && !member) {
                const resMember = resolveMember(message, hex);
                return resMember ?  resMember.displayHexColor : hex;
            }
            else
                return member ? member.displayHexColor : hex;
        }

        const hexColor = random ? Math.floor(Math.random()*0xFFFFFF<<0).toString(16) : resolveColor();
        
        try {
            new Jimp(255, 255, hexColor, async (err: any, image: imgType) => {
                if(err)
                    return Responder.fail(message, 'Could not generate image try again!');
    
                const attatchment = new MessageAttachment(await image.getBufferAsync('image/png'), 'img.png');
                
                await message.channel.send(this.client.util.embed()
                    .setTitle(hexColor)
                    .attachFiles([attatchment])
                    .setThumbnail(`attachment://${attatchment.name}`)
                    .setColor(hexColor));
            });
        } catch(err) {
            Responder.fail(message, 'Could not generate image try again!');
        }
    }
}