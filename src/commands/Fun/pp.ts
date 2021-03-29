import { Command } from 'discord-akairo'; 
import { Message, GuildMember } from 'discord.js';
import { randRange } from '../../services/utils';

export default class PP extends Command {
    constructor() {
        super('pp', {
            aliases: ['penis', 'pp'],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Generates a totally accurate penis',
            args: [
                {
                    id: 'member',
                    type: 'member',
                    match: 'rest',
                    default: (message: Message) => message.member
                },
            ],
        });
    }
    async exec(message: Message, { member }: { member: GuildMember}) {
        const penis = `**${'8' + '='.repeat(randRange(1, 16)) + 'D'}**`;

        message.channel.send(this.client.util.embed()
        .setAuthor(`${member.user.username}'s penis`, member.user.displayAvatarURL())
        .setDescription(penis)
        .setColor('RANDOM'));
    }
}