import { Message } from "discord.js";


/**
 * the callback must always take at least one param and thats the offset which will be the data getting incremented by the amount param
 * it can also take a second optional paramater that will be the page number
 * 
 * @param amount the amount to increment or decrement by when the page changes
 */
export async function paginate(message: Message, amount: number, fn: Function) {

    let   page   = 1;
    let   offset = 0;
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