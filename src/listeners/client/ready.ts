import { Listener } from 'discord-akairo';
import { sequelize } from '../../services/database';
import client from '../../index';

export default class ReadyEvent extends Listener{
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        });
    }
    async exec() {
        console.log(`${this.client.user?.username} is online!`);

        this.client.user?.setActivity('Running rewrite test build!');

        await sequelize.sync();
        await client.settings.init();
    }
}