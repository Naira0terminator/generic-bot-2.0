import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import { GuildMember } from 'discord.js';
import { resolveMember } from '../../services/utils';
import { paginate } from '../../services/pagination';

export default class Partnerships extends Command {
    constructor() {
        super('partnerships', {
            aliases: ['partnerships', 'partners'],
            cooldown: 10000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Shows how many partnerships you have. use the comamnd with `lb` as an argument to see the leaderboard.',
            args: [
                {
                    id: 'lb',
                    match: 'flag',
                    flag: 'lb'
                },
                {
                    id: 'member',
                    match: 'rest',
                    type: 'member',
                    default: (message: Message) => message.member
                }
            ]
        });
    }
    async exec(message: Message, { lb, member }: { lb: string, member: GuildMember }) {
        
        if(lb) {
            
            const createEmbed = async (offset: number, page: number) => {

                const data = (await client.sql.query(`
                select count, member_id, RANK() OVER (ORDER BY count DESC) from partnerships limit 10 offset $1`, [offset]))
                .rows;
            
                const formated = !data ? 'No partnerships have been set in this server' : data.map(element => {
                    let member = resolveMember(message, element.member_id)?.user.username ?? element.member_id;
                    
                    return `\`[${element.rank}]\` | ${member} - ${element.count}`});

                return client.util.embed()
                    .setTitle('Partnerships leaderboard')
                    .setDescription(!formated.length ? 'Empty page' : formated)
                    .setColor('RANDOM')
                    .setFooter(`Page: ${page}`);
            }

            await paginate(message, 10, createEmbed);

            return;
        }

        const data = (await client.sql.query('SELECT count, weekly FROM partnerships WHERE member_id = $1', [member.id]))
            .rows[0];
        const rank = (await client.sql.query('SELECT ranked.* from( select member_id, RANK() OVER (ORDER BY count DESC) as rank from partnerships) as ranked where member_id = $1', [member.id]))
            .rows[0];

        if(!data)
            return responder.fail(message, 'the provided member does not have any partnerships');

        message.channel.send(client.util.embed()
            .setAuthor(member.user.username, member.user.displayAvatarURL())
            .setDescription(`**Total** ${data.count} | **Weekly** ${data.weekly ?? 0}`)
            .setColor(member.displayHexColor)
            .setFooter(`Rank #${rank.rank ?? 'No rank'}`));
    }
}