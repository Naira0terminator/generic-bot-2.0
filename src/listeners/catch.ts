import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import client from '../index';
import { random } from '../services/utils';

export default class catchEvent extends Listener {
    constructor() {
        super('catch', {
            emitter: 'client',
            event: 'message',
        });
    }
    async exec(message: Message) {

        if(message.author.bot || message.channel.type === 'dm') 
            return;

        const guildCatchData    = client.settings.get(message.guild?.id!, `catchChannel`, null);
        const catchState        = client.settings.get(message.guild?.id!, `catchState`, null);
        const channel           = message.guild?.channels.cache.get(guildCatchData!) as TextChannel;

        if(!channel || !catchState) 
            return;

       if(channel.id === message.channel.id) {
           const prefixArray = ['!', '.', '<'];
           const suffixArray = ['get', 'catch', 'gimme', 'mine'];
           const prefix      = prefixArray[random(prefixArray.length)];
           const suffix      = suffixArray[random(suffixArray.length)];
           const catchWord   = prefix + suffix;
           const chance      = random(100);

          if(chance <= 3) {

            const filter = (message: Message) => message.content.toLowerCase() === catchWord && !message.member?.user.bot; 
            const collector = message.channel.createMessageCollector(filter, { time: 10000});

            const msg = await message.channel.send(`🐱 | a wild cat appears catch it with \`${catchWord}\``);

            let isCaught = false;

            collector.once('collect', async (message: Message) => {

                if(isCaught)
                    return;

                isCaught = true;

                const amount = await client.redis.zincrby(`guild[${message.guild?.id}]-catch`, 1, message.author.id);
                await client.leveler.addExp(message.member!);

                await msg.edit(`caught by **${message.author.tag}**. total cats: \`${amount}\``)
            });

            collector.once('end', async (collected) => {
                
                await msg.delete();
                await channel.bulkDelete(collected);

                if(!isCaught)
                    message.channel.send('no one caught it in time!').then(m => m.delete({timeout: 5000}));
            });
          }
        }
    }
}