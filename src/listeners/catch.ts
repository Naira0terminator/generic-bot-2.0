import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import client from '../index';

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
        const channel           = message.guild?.channels.cache.get(guildCatchData!);

        if(!channel || !catchState) 
            return;

        const prefixArray = ['!', '.', '<'];
        const suffixArray = ['get', 'catch', 'gimme', 'mine'];
        const prefix = prefixArray[Math.floor(Math.random() * prefixArray.length)];
        const suffix = suffixArray[Math.floor(Math.random() * suffixArray.length)];
        const catchWord = prefix + suffix;
        
       if(channel.id === message.channel.id) {
          const chance = Math.floor(Math.random() * 100);

          if(chance <= 3) {

            const filter = (message: Message) => message.content.toLowerCase().includes(catchWord) && !message.member?.user.bot; 
            const collector = message.channel.createMessageCollector(filter, { time: 10000});

            message.channel.send(`🐱 | a wild cat appears catch it with \`${catchWord}\``).then(m => m.delete({timeout: 10000}));

            collector.once('collect', async (message: Message) => {

                const amount = await client.redis.zincrby(`guild[${message.guild?.id}]-catch`, 1, `${message.author.id}`);
                await client.leveler.addExp(message.member!);

                message.channel.send(`caught by **${message.author.tag}**. total cats: \`${amount}\``).then((m: Message) => m.delete({timeout: 5000}));
                collector.stop('caught');
            });

            collector.once('end', (collected, reason: string) => {
                collected.forEach(msg => msg.delete());

                if(reason === 'caught')
                    return;

                message.channel.send('no one caught it in time!').then(m => m.delete({timeout: 5000}));
            });
          }
        }
    }
}