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
export const random = (value: number = 1) => Math.floor(Math.random() * value);

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

    for(const key in variables)
        parsed = parsed.replace(new RegExp(key, 'g'), variables[key] as string);

    return parsed;
}

export const varParseObj = (obj: any, member: GuildMember) => {

    const data: any = {...obj};

    for(const [key, value] of Object.entries(data)) {

        if(typeof data[key] === 'object' && !Array.isArray(data[key]) && data[key]) {

            for(const [k, v] of Object.entries(data[key]))
                data[key][k] = varParser(v, member);

            continue;
        }

        data[key] = varParser(value, member);
    }

    return data;
}

// small class for benchmarking
export class Timer {
    private start: [number, number]

    constructor() {
        this.start = process.hrtime()
    }

    // returns time since start as ms
    public elapsed() {
        const end = process.hrtime(this.start);
        return (end[0]* 1000000000 + end[1]) / 1000000
    }

    // prints elapsed time
    public print() {
        console.log(`Time: ${this.elapsed()}`)
    }
    
}

// a unicode regex
export const unicode = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
