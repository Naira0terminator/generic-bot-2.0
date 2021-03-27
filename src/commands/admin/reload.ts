import { Command } from 'discord-akairo';
import client from '../../index'; 
import { Message } from 'discord.js';
import responder from '../../services/responder';

export default class Reload extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload'],
            ownerOnly: true,
            args: [
                {
                    id: 'cmd',
                    type: 'string',
                    match: 'rest',
                },
                {
                    id: 'event',
                    match: 'flag',
                    flag: '-e',
                },
                {
                    id: 'load',
                    match: 'flag',
                    flag: '-l',
                },
                {
                    id: 'all',
                    match: 'flag',
                    flag: '-all',
                }
            ],
        });
    }
    exec(message: Message, { cmd, event, all }: any) {

        try {
            let response = '';

            if(event) {
                client.listenerHandler.reload(cmd);
                response = `listener [**${cmd}**] has been reloaded!`
            }
            else if(all) {
                client.commandHandler.reloadAll();
                client.listenerHandler.reloadAll();
                response = "All commands and listeners have been reloaded!";
            }
            else {
                client.commandHandler.reload(cmd);
                response = `command [**${cmd}**] has been reloaded!`
            }
            
            return message.util?.send(this.client.util.embed()
            .setDescription(response)
            .setColor('GREEN'));
        } catch(err) {
            responder.fail(message, `Could not find that command/listener ${err.message}`);
        }
    }
}
