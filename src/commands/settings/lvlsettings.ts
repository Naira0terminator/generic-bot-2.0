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
            description: 'allows you to customize the leveling system. use the command with `options` to see the setting options',
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
                    id: 'toggle',
                    match: 'flag',
                    flag: 'toggle',
                },
                {
                    id: 'options',
                    match: 'flag',
                    flag: 'options',
                },
                {
                    id: 'value',
                    type: Argument.compose('lowercase'),
                }
            ]
        });
    }
    async exec(message: Message, { replace, msg, leaver, cooldown, modifier, value, toggle, options }: any) {
        
        if(options) {
            return responder.send(message, `
                **Usage** \`<prefix>level-settings <setting> <argument>\`
                **Example** \`,level-settings replace on\`
                \n
                \`replace\` on/off | if set on it will replace the members previous level role. not including reward roles.\n
                \`msg\` on/off | sets the message response to leveling up.\n
                \`leaver\` on/off | if set to on it will remove a members exp and level if they leave the server.\n
                \`cooldown\` numerical value in seconds | sets the cooldown for earning exp.\n
                \`modifer\` numerical value | sets the amount of bonus exp a member will earn on every new message.\n
                \`toggle\` no argument | toggles the leveling system on and off.\n
            `);
        }

        const intValue = parseInt(value);
        if(cooldown) {
            if(isNaN(intValue)) 
                return responder.fail(message, 'given value is not a valid number!');

            await client.redis.hset(`guild[${message.guild?.id}]-exp-modifiers`, 'cooldown', intValue * 1000);
            return responder.send(message, `members will now earn exp only once every **${intValue}** seconds`);
        }

        if(toggle) {
            const state = client.settings.get(message.guild?.id!, 'leveling-state', true);
            await client.settings.set(message.guild?.id!, 'leveling-state', !state ? true : false);

            return responder.send(message, `The leveling system has been set to ${!state ? '`on`' : '`off`'}`);
        }

        if(modifier) {
            if(isNaN(intValue) || intValue > 100 && intValue < 1) 
                return message.reply('given value is not a valid number above 0 and under 100!');

            await client.redis.hset(`guild[${message.guild?.id}]-exp-modifiers`, 'exp-modifier', intValue);
            return responder.send(message, `Members will now recieve +**${intValue}** exp`);
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
        const state = await client.settings.get(message.guild?.id!, 'leveling-state', true);

        message.channel.send(this.client.util.embed()
        .setTitle('Level settings')
        .setDescription('Set data with <prefix>level-settings <type> on/off\n**Types** replace, leaver, msg')
        .addField('Level replacing', await displayData('replace'), true)
        .addField('Level up message', await displayData('msg'), true)
        .addField('Leaver EXP loss', await displayData('leaver'), true)
        .addField('Exp cooldown',`\`${!cooldown ? 'Default cooldown' : cooldown / 1000 + ' Seconds'}\``, true)
        .addField('Exp Modifier', `\`${!expMod ? 'No modifier set' :  '+' + expMod + ' EXP'}\``, true)
        .setFooter(`State: ${state ? 'on' : 'off'} | use the command with the argument options to see setting options`)
        .setColor('RANDOM'));
    }
}