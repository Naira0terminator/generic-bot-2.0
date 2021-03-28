import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import moment from 'moment';

export default class User extends Command {
    constructor() {
        super('user', {
            aliases: ['user', 'whois'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets info on yours or a provided members user info',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    default: (message: Message) => message.member,
                }
            ]
        });
    }
    async exec(message: Message, { member }: { member: GuildMember }) {
        
        const formatDate = (date: Date | null) => moment(date!).format('dddd, MMMM Do YYYY, HH:mm');
        message.channel.send(this.client.util.embed()
            .setAuthor(member.user.username, member.user.displayAvatarURL())
            .addField('● Joined at', formatDate(member.joinedAt), true)
            .addField('● Created at', formatDate(member.user.createdAt), true)
            .addField('● Permissions', member.permissions.toArray().map(perm => perm.toLowerCase().replace(/_/g, ' ')).join(', '))
            .setColor(member.displayHexColor === '#000000' ? 'RANDOM' : member.displayHexColor)
            .setFooter(`ID ${member.id}`))
    }
}