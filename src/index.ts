import { KeyObject } from 'crypto';
import { Key } from 'readline';
import Client from './client';
import { sequelize, redis } from './services/database';

const client = new Client();

client.start();

//process.stdin.setRawMode(true);
process.stdin.on('keypress', (_, key: Key) => {
    if(key && key.ctrl && key.name === 'c')
        process.exit(0);
})

// proccess cleanup
process.on('exit', async () => {
    await sequelize.close();
    await redis.quit();

    console.log('finished cleanup! shutting down.');
});

export default client;


/** TODO
 * moderation   []
 * logging      []
 * economy      []
 * gambling     []
 * music player []
 * statistics   []
 * invite log   []
 */
