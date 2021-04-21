import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';
import moment from 'moment'

export default class Server extends Command {
    constructor() {
        super('server', {
            aliases: ['server-info', 'server'],
            cooldown: 8000,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'Gets information on the command server',
        });
    }
    async exec(message: Message) {
        const guild = message.guild;
        const createdAt = moment(guild?.createdAt)
        
        message.channel.send(this.client.util.embed()
            .setAuthor(`${guild?.name}`, guild?.iconURL({format: 'png', dynamic: true, size: 2048})!)
            .addField('● Created at', createdAt.format('YYYY/M/D, H:m:s'), true)
            .addField('● Member count', guild?.memberCount, true)
            .addField('● Ban count', (await guild?.fetchBans())?.size, true)
            .addField('● Owner', guild?.owner?.user.username)
            .setColor('RANDOM')
            .setFooter(`ID: ${guild?.id} | created ${createdAt.fromNow()}`))
    }
}