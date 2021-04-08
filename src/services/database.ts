import Redis from 'ioredis';
import { Sequelize } from 'sequelize';
import PG from 'pg';

export const sql = new PG.Client( {
    host: 'localhost',
    password: 'yes900x20',
    user: 'postgres',
    database: 'generic_bot',
});

sql.on('error', (err) => console.log(`postgres ran into an error ${err.message}`));

export async function init_psql() {
    await sql.connect()
        .then(() => console.log('postgres has connected'))
        .catch(err => console.log(`postgres could not connect ${err.message}`));

    try {
        await sql.query('CREATE TABLE IF NOT EXISTS marriage(guild TEXT, couple TEXT [], date TEXT)');
    } catch(err) {
        console.log(`Error creating one or more postgres tables ${err.message}`);
    }
}

export const redis = new Redis();
redis.on('connect', () => console.log('Redis has connected!'));

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'settings.sqlite',
    logging: false,
});

(async () => await sequelize.authenticate()
.catch(err => console.log(`Unable to authenticate Sequelize ${err}`)))();
console.log('Sequelize has been authenticated');


export namespace queries {
    export const settings = {
        prefix: 'prefix',
        boosterRole: 'booster-role',
        MemberBoosterRole: (id: string) => `${id}-boosterRole`,
        muteRole: 'mute-role',
        removeRoles: 'mute-remove-roles'
    }

}