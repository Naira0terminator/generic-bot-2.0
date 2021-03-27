import Redis from 'ioredis';
import { Sequelize } from 'sequelize';

export const redis = new Redis();
redis.on('connect', () => console.log('Redis has connected!'));

export const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'Sequelize-db.sqlite',
});

try {
    (async () => await sequelize.authenticate())();
    console.log('Sequelize has been authenticated');
} catch(err) {
    console.log(`Unable to authenticate Sequelize ${err}`);
}

export namespace queries {
    export const settings = {
        prefix: 'prefix',
        boosterRole: 'booster-role',
        MemberBoosterRole: (id: string) => `${id}-boosterRole`,
        muteRole: 'mute-role',
        removeRoles: 'mute-remove-roles'
    }

}