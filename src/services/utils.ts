import { Message, GuildMember } from 'discord.js';
import client from '..';


// these resolve functions will only ever be used in commands and just so i could have access to the mentions i decided to take a message object as the paramater
export const resolveChannel = (message: Message, object: string) => {
    return message.guild?.channels.cache.get(object) || message.mentions.channels.first() || message.guild?.channels.cache.find(ch => ch.name.toLowerCase() === object.toLowerCase());
}

export const resolveRole = (message: Message, object: string) => {
    return message.guild?.roles.cache.get(object) || message.mentions.roles.first() || message.guild?.roles.cache.find(rl => rl.name.toLowerCase() === object.toLowerCase());
}

export const resolveMember = (message: Message, object: string) => {
    return message.guild?.members.cache.get(object) || message.mentions.members?.first() || message.guild?.members.cache.find(mem => mem.user.username.toLowerCase() === object.toLowerCase());
}

export const resolveGuild = (object: string) => {
    return client.guilds.cache.find(guild => guild.name.toLowerCase() === object.toLowerCase()) || client.guilds.cache.get(object);
}

// checks if a string includes at least one of the provided strings
export const includesOne = (str: string, match: string[]) => {
    for(const word of match) {
        if(str === word)
            return true
    }
    return false;
}

// crappy uid generator
export const uid = (size: number = 4) => {
    let str = '';

    for(let i = 0; i !== size; i++)
        str += String(Math.floor(Math.random() * 10));

    return str;
}

// handy random number gen functions
export const randRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const random = (value: number) => Math.floor(Math.random() * value);

// parses a string with variables and returns the string with the appropriate values mostly useful for the embed builder command or custom welcomes.
export const varParser = (str: any, member: GuildMember) => {

    // this is done to prevent type conversions when working with unkwown objects
    if(typeof str !== 'string')
        return str;

    let parsed = str;

    const variables: any = {
        "{memberName}": member.user.username,
        "{memberMention}": member.user,
        "{memberID}": member.id,
        "{serverName}": member.guild.name,
        "{serverID}": member.guild.id,
        "{memberCount}": member.guild.memberCount,
        "{memberAvatar}": member.user.displayAvatarURL({dynamic: true, size: 2048}),
        "{serverAvatar}": member.guild.iconURL({dynamic: true, size: 2048}),
    }

    for(const [key, value] of Object.entries(variables))
        parsed = parsed.replace(new RegExp(key, 'g'), String(value));

    return parsed;
}
