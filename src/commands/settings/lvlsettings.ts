import { Command, Argument } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class Name extends Command {
    constructor() {
        super('lvlsettings', {
            aliases: ['level-settings', 'lvl-settings', 'lsettings'],
            cooldown: 0,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: '',
            args: [
                {
                    id: 'replace',
                    match: 'flag',
                    flag: 'replace'
                },
                {
                    id: 'msg',
                    match: 'flag',
                    flag: 'msg'
                },
                {
                    id: 'leaver',
                    match: 'flag',
                    flag: 'leaver'
                },
                {
                    id: 'cooldown',
                    match: 'flag',
                    flag: 'cooldown',
                },
                {
                    id: 'modifier',
                    match: 'flag',
                    flag: 'modifier',
                },
                {
                    id: 'value',
                    type: Argument.compose('lowercase'),
                }
            ]
        });
    }
    async exec(message: Message, { replace, msg, leaver, cooldown, modifier, value}: any) {

        const intValue = parseInt(value);
        if(cooldown) {
            if(isNaN(intValue)) 
                return message.reply('given value is not a valid number!');
            await client.redis.hset(`guild[${message.guild?.id}]-exp-modifiers`, 'cooldown', intValue * 1000);
            return message.channel.send(`members will now earn exp only once every **${intValue}** seconds`);
        }

        if(modifier) {
            if(isNaN(intValue) || intValue > 100 && intValue < 1) 
                return message.reply('given value is not a valid number above 0 and under 100!');
            await client.redis.hset(`guild[${message.guild?.id}]-exp-modifiers`, 'exp-modifier', intValue);
            return message.channel.send(`Members will now recieve +**${intValue}** exp`);
        }

        if(value && !(value === 'on' || value === 'off')) 
            return responder.fail(message, 'Invalid setting! try \`on\` or \`off\`');
        

        const handleSettings = async (action: string, response: string) => {
            await client.redis.set(`guild[${message.guild?.id}]-exp-${action}`, value);
            responder.send(message, `${response} \`${value === 'on' ? 'Enabled' : 'Disabled'}\``);
        }

        if(replace) 
            return handleSettings('replace', `Level role replacing:`);

        if(msg) 
            return handleSettings('msg', `Level up message:`);

        if(leaver) 
            return handleSettings('leaver', `Leaver EXP loss:`);

        const displayData = async (data: string) => {
            const state = await client.redis.get(`guild[${message.guild?.id}]-exp-${data}`);
            return `${state === 'on' ? '`Enabled`' : '`Disabled`'}`;
        }
        
        cooldown = await client.redis.hget(`guild[${message.guild?.id}]-exp-modifiers`, 'cooldown');
        const expMod = await client.redis.hget(`guild[${message.guild?.id}]-exp-modifiers`, 'exp-modifier');

        message.channel.send(this.client.util.embed()
        .setTitle('Level settings')
        .setDescription('Set data with <prefix>level-settings <type> on/off\n**Types** replace, leaver, msg')
        .addField('Level replacing', await displayData('replace'), true)
        .addField('Level up message', await displayData('msg'), true)
        .addField('Leaver EXP loss', await displayData('leaver'), true)
        .addField('Exp cooldown',`\`${!cooldown ? 'Default cooldown' : cooldown / 1000 + ' Seconds'}\``, true)
        .addField('Exp Modifier', `\`${!expMod ? 'No modifier set' :  '+' + expMod + ' EXP'}\``, true)
        .setColor('RANDOM'));
    }
}