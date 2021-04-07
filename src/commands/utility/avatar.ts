import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';

export default class Avatar extends Command {
    constructor() {
        super('avatar', {
            aliases: ['avatar', 'av', 'pfp'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Get the pfp of yourself, another member or the server with `-server`',
            args: [
                {
                    id: 'server',
                    match: 'flag',
                    flag: 'server',
                },
                {
                    id: 'member',
                    match: 'rest',
                    type: 'member',
                    default: (message: Message) => message.member,
                }
            ]
        });
    }
    async exec(message: Message, { server, member }: { server: string, member: GuildMember}) {
        const url = server ? message.guild?.iconURL({format: 'png', dynamic: true, size: 2048})! : member.user.displayAvatarURL({format: 'png', dynamic: true, size: 2048});
        
        message.channel.send(this.client.util.embed()
            .setDescription(`[URL](${url})`)
            .setImage(url)
            .setColor(server ? 'RANDOM' : member.displayHexColor));
    }
}