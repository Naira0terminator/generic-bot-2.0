import { Command } from 'discord-akairo'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';
import client from '../../index';

export default class SettingsDB extends Command {
    constructor() {
        super('settingsdb', {
            aliases: ['settings-db', 'sdb'],
            ownerOnly: true,
            clientPermissions: ['SEND_MESSAGES'],
            channel: 'guild',
            description: 'A command for accessing and manipulating the settings database',
            args: [
                {
                    id: 'id',
                },
                {
                    id: 'key'
                },
                {
                    id: 'value',
                    match: 'rest'
                },
                {
                    id: 'set',
                    match: 'flag',
                    flag: '-set'
                },
                {
                    id: 'del',
                    match: 'flag',
                    flag: '-delete'
                },
                {
                    id: 'clear',
                    match: 'flag',
                    flag: '-clear'
                },
                {
                    id: 'get',
                    match: 'flag',
                    flag: '-get'
                }
            ]
        });
    }
    async exec(message: Message, { id, key, value, set, del, clear, get}: any) {
        
        if(!id || !key)
            return responder.fail(message, 'You must provide a valid id key and value');

        const wrap = (data: any) => '```json\n' + data + '```';

        if(get) {
            const data = client.settings.get(id, key, value);
            return responder.send(message, wrap(JSON.stringify(data)));
        } 
        if(set) {
            const data = await client.settings.set(id, key, JSON.parse(value));
            return responder.send(message, wrap(data));
        }
        if(del) {
            const data = await client.settings.delete(id, key);
            return responder.send(message, wrap(data));
        }
        if(clear) {
            await client.settings.clear(id);
            return responder.send(message, 'Key has been cleared!');
        }

        responder.fail(message, 'That is not a valid flag');
    }
}