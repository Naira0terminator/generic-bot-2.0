import { Message, MessageEmbed } from 'discord.js';

export default class Responder {
    static error(message: Message, err: any) {
        message.channel.send(new MessageEmbed()
        .setDescription(`**Error** \`\`\`${err}\`\`\``)
        .setColor('RED'));
    }
    
    static fail(message: Message, response: string) {
        message.reply(new MessageEmbed()
        .setDescription(`⚠️  ${response}`)
        .setColor('RED'));
    }
    
    static send(message: Message, response: string, ops: any = null) {
        let color = 'GREEN';

        if(ops ? ops.color : false)
            color = ops.color;

        message.channel.send(new MessageEmbed()
        .setDescription(response)
        .setColor(color));
    }
}