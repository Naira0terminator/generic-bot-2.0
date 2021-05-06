import { TextChannel } from "discord.js";
import client from "..";

// i made this function to cache reaction role messages when the bot starts but then i realized you can run events on
// none cached data using partials so it became kinda pointless.

async function cache_reaction_messages() {

    // Data will be stored as so
    // all values will be snowflake ids 
    // {
    //     "guild": {
    //         "channel": ['msg']
    //     }
    // }

    const index: any = {};
    
    for(const [id, _] of client.settings.items) {
        
        // sometimes the data can be something other then a guild id so it checks against that
        if(!id.match(/^\d+$/))
            continue;

        const guildIDS = Object.entries(client.settings.items.get(id))
        for(const [key, _] of guildIDS) {

            // data will always be channelid_messageid-reactRole
            
            if(!key.endsWith('reactRole'))
                continue;
            
            if(!index[id])
                index[id] = {};

            const channelID = key.slice(0, key.indexOf('_'));
            const messageID = key.slice(key.indexOf('_') + 1, key.indexOf('-'));

            if(!index[id][channelID])
                index[id][channelID] = [];

            index[id][channelID].push(messageID);
        }
    }

    //console.log(index);

   const entries = Object.entries(index);

   for(const [key, value] of entries) {
        const guild = await client.guilds.fetch(key);
        
        if(!guild)
            continue;

        for(const [channelID, msgs] of Object.entries(value as any)) {
            const channel = await client.channels.fetch(channelID) as TextChannel;
            
            if(!channel)
                continue;

            for(const id of msgs as Array<string>) {
                await channel.messages.fetch(id, true);
            }
        }
   }
}