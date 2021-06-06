import { Listener } from 'discord-akairo';
import { sequelize } from '../../services/database';
import client from '../../index';
import { init_psql } from '../../services/database';
import * as ns from 'node-schedule';
import * as weekly_functions from '../../services/weekly functions';

export default class ReadyEvent extends Listener{
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }
    async exec() {

        await init_psql();

        // will run at every sunday 12 am 
        ns.scheduleJob({dayOfWeek: 0, hour: 0}, async () => {
            console.log('Running weekly functions...');
            await weekly_functions.reset_partnerships();
        });

        await sequelize.sync();
        await client.settings.init();

        console.log(`${this.client.user?.username} is online!`);
        this.client.user?.setActivity('Beep Boop!');
    }
}
