import Sqlite from 'better-sqlite3';

// i defined sqlite3 in the constructor instead of extending it cause it threw a weird error that said x function does not exist when using the class methods.
// i looked it up and its an issue with extending in typescript. composition ftw!!!
export default class Settings {
    sql: Sqlite.Database;
    name: string;

    constructor(name: string) {
        this.sql = new Sqlite(name);
        this.name = name.endsWith('.sqlite') ? name.slice(0, name.indexOf('.', -1)) : name;

        this.sql.prepare(`CREATE TABLE IF NOT EXISTS ${this.name} (guild PRIMARY KEY, key TEXT, value TEXT)`)
            .run();
    }

    set(guild: string, key: string, value: any) {
        return this.sql.prepare(`INSERT OR REPLACE INTO ${this.name} (guild, key, value) VALUES (?, ?, ?)`)
            .run(guild, key, value);
    }

    get(guild: string, key: string) {
        return this.sql.prepare(`SELECT * FROM ${this.name} WHERE guild = ? AND key = ?`)
            .get(guild, key);
    }

    delete(guild: string, key: string) {
        return this.sql.prepare(`DELETE FROM ${this.name} WHERE guild = ? AND key = ?`)
            .run(guild, key);
    }

    exists(guild: string, key: string) {
        const exists = this.sql.prepare(`SELECT guild, key FROM ${this.name} WHERE guild = ? AND key = ?`).get(guild, key);
        
        if(exists)
            return true;

        return false;
    }
}