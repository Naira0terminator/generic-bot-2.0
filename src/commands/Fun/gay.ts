import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import { randRange } from '../../services/utils';

export default class Name extends Command {
    constructor() {
        super('gay', {
            aliases: ['gay'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Use the gay rate machine to check how gay you or a provided member is',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: (message: Message) => message.member
                }
            ]
        });
    }
    async exec(message: Message, { member }: { member: GuildMember}) {
        message.channel.send(this.client.util.embed()
        .setAuthor('gay rate', member.user.displayAvatarURL())
        .setDescription(`**${member.user.username}** is \`${randRange(1, 110)}\`% gay 🏳️‍🌈`)
        .setColor('RANDOM')
        .setFooter('the gay rate machine is 100% accurate'));
    }
}