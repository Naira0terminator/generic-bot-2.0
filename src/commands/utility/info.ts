import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import client from '../../index';
import os from 'os'

export default class Info extends Command {
    constructor() {
        super('info', {
            aliases: ['info'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets statistical info about the bot',
        });
    }
    exec(message: Message) {

        let totalSeconds = (this.client.uptime! / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days === 0 ? "" : `${days} days,`} ${hours === 0 ? "" : `${hours} hours,`} ${minutes === 0 ? "" : `${minutes} minutes,`} ${seconds === 0 ? "" : `${seconds} seconds`}`;
        
        message.util?.send(this.client.util.embed()
        .setAuthor(`${this.client.user!.username}`)
        .setDescription(
            `[Source Code](https://github.com/Naira0terminator/generic-bot)

            **Uptime** \`${uptime.trim()}\`\n
            **Commands** \`${client.commandHandler.modules.size}\` | **Listeners** \`${client.listenerHandler.modules.size}\`\n
            **Library** \`Discord.js\`\n
            **memory usage** \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${Math.round(os.totalmem()/1024/1024)} GB\`\n
            **servers** \`${this.client.guilds.cache.size}\` | **users** \`${this.client.users.cache.size}\``)
        .setThumbnail(this.client.user!.displayAvatarURL())
        .setFooter('Created by Naira#0666')
        .setColor('RANDOM'));
    }
}