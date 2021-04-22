import { Listener } from 'discord-akairo';
import { sequelize } from '../../services/database';
import client from '../../index';
import { init_psql } from '../../services/database';

export default class ReadyEvent extends Listener{
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }
    async exec() {

        await init_psql();

        console.log(`${this.client.user?.username} is online!`);

        this.client.user?.setActivity('Generic-bot 2.0 alpha');

        await sequelize.sync();
        await client.settings.init();
    }
}