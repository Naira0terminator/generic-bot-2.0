import { Listener } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import client from '../index';
import { random, randRange } from '../services/utils';

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
           const chance      = randRange(1, 100);

          if(chance <= 3) {

            const filter = (message: Message) => message.content.toLowerCase() === catchWord && !message.member?.user.bot; 
            const collector = message.channel.createMessageCollector(filter, { time: 10000});

            const msg = await message.channel.send(`🐱 | a wild cat appears catch it with \`${catchWord}\``);

            let isCaught = false;

            collector.on('collect', async (message: Message) => {

                if(isCaught) {
                    message.delete();
                    return;
                }

                isCaught = true;

                const amount = await client.redis.zincrby(`guild[${message.guild?.id}]-catch`, 1, message.author.id);
                await client.leveler.addExp(message.member!);

                await message.delete();
                await msg.edit(`caught by **${message.author.tag}**. total cats: \`${amount}\``)
                    .then(msg => msg.delete({timeout: 5000}));
            });

            collector.once('end', async () => {
                if(isCaught) 
                    return;

                await msg.edit('the cat escaped no one caught it in time!')
                    .then(m => m.delete({timeout: 5000}))
            });
          }
        }
    }
}