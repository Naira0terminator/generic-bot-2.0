import { sql } from './database';

export default class Settings {
    public async set(id: string, key: string, value: any) {
        let result;
        try {
            result = await sql.query(`INSERT INTO settings (id, key, value) VALUES (${id}, ${key}, ${JSON.stringify(value)})
            ON CONFLICT (key) DO UPDATE SET key = key`);
        } catch(err) {
            return null;
        }
        return result.rows;
    }

    public async get(id: string, key: string, def?: any) {
        let result;
        try {
            result = await sql.query(`SELECT value FROM settings where id = ${id} and key = ${key}`);
        } catch(err) {
            return null;
        }

       return result.rowCount ? result.rows : def;
    }
}