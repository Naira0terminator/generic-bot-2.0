import { Message } from "discord.js";


/**
 * the fn paramater always has to be a function that returns an embed it should take an offset and 
 * a page paramater the offset will be the data getting increamented ie the item you're looping over
 */
export async function paginate(message: Message, data: number, amount: number, fn: Function) {

    let   page   = 1;
    let   offset = data;
    const msg    = await message.channel.send(await fn(offset, page));

    await msg.react('⬅️');
    await msg.react('➡️');
    
    const collector = msg.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, {time: 60000});

    collector.on('collect', async r => {
        if(r.emoji.name === '➡️') {
            page   += 1;
            offset += amount;
            await msg.edit(await fn(offset, page));
        }
        if(r.emoji.name === '⬅️') {
            page   -= page   <= 1   ? 0   : 1; 
            offset -= offset <= 0   ? 0   : amount;
            await msg.edit(await fn(offset, page));
        }
        r.users.remove(message.author.id);
    });

    collector.on('end', async () => {
        await msg.reactions.removeAll();
    });
}