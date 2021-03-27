import { Message, Client, CollectorFilter } from 'discord.js';
import client from '..';

export default class Prompt {
    filter: CollectorFilter;
    collected: Map<Message, Message>;

    constructor(filter: CollectorFilter) {
        this.filter = filter;
        this.collected = new Map();
    }

    collect(message: Message, question?: string, time?: number): Promise<Message|undefined> {
        return new Promise((resolve, reject) => {
            if(question)
                message.channel.send(question);

            const collector = message.channel.createMessageCollector(this.filter, {time: time});
        
            collector.once('collect', (msg: Message) => {
                this.collected.set(message, msg);
                console.log(msg.content);
            });

            resolve(this.collected.get(message));
        }); 
    }
}