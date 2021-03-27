import { Message } from 'discord.js';

// did someone say stupidly long one liner

export const resolveChannel = (message: Message, object: string) => {
    return message.guild?.channels.cache.get(object) || message.mentions.channels.first() || message.guild?.channels.cache.find(ch => ch.name.toLowerCase() === object.toLowerCase());
}

export const resolveRole = (message: Message, object: string) => {
    return message.guild?.roles.cache.get(object) || message.mentions.roles.first() || message.guild?.roles.cache.find(rl => rl.name.toLowerCase() === object.toLowerCase());
}

export const resolveMember = (message: Message, object: string) => {
    return message.guild?.members.cache.get(object) || message.mentions.members?.first() || message.guild?.members.cache.find(mem => mem.user.username.toLowerCase() === object.toLowerCase());
}

export const includesOne = (str: string, match: string[]) => {
    for(const word of match) {
        if(str === word)
            return true
    }
    return false;
}

export const uid = (size: number = 4) => {
    let str = '';

    for(let i = 0; i !== size; i++)
        str += String(Math.floor(Math.random() * 10));

    return str;
}
