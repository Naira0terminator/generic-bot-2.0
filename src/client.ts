import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, SequelizeProvider } from 'discord-akairo';
import { Message } from 'discord.js';
import config from './config.json';
import Responder  from './services/responder';
import { redis, sequelize, sql } from './services/database';
import Redis from 'ioredis';
import Leveler from './services/leveler';
import { Sequelize } from 'sequelize/types';
import Settings from './models/settings';
import { join } from 'path';
import PG from 'pg';
import Scheduler from './services/scheduler';

export default class Client extends AkairoClient {
    commandHandler: CommandHandler;
    inhibitorHandler: InhibitorHandler;
    listenerHandler: ListenerHandler;
    responder: Responder;
    redis: Redis.Redis;
    sequelize: Sequelize;
    leveler: Leveler;
    settings: SequelizeProvider;
    snipeCache: Map<string, any>;
    sql: PG.Client;
    scheduler: Scheduler;

    constructor() {
        super({ownerID: config.ownerID,} , {disableMentions: 'everyone'})

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname + '/commands/'),
            prefix: async (message: Message): Promise<any> => {
                if(message.guild) 
                    return this.settings.get(message.guild?.id, 'prefix', config.prefix)

                return config.prefix;
            },
            allowMention: true,
            aliasReplacement: /-/g,
            handleEdits: true,
            commandUtil: true,
            defaultCooldown: 3000,
            ignoreCooldown: config.ownerID,
            ignorePermissions: config.ownerID,
            automateCategories: true,
        });

        this.inhibitorHandler = new InhibitorHandler(this, {directory: join(__dirname + '/inhibitors/')});
        this.listenerHandler = new ListenerHandler(this, {directory: join(__dirname + '/listeners/')});

        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });

        this.responder = Responder;
        this.redis = redis;
        this.sequelize = sequelize;
        this.leveler = new Leveler();
        this.snipeCache = new Map();
        this.sql = sql;
        this.scheduler = new Scheduler();

        this.settings = new SequelizeProvider(Settings, {
            idColumn: 'guildID',
            dataColumn: 'settings'
        });

        this.commandHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
    }

    start() {
        console.log('Attempting to login...');

        try {
            this.login(config.token);
        } catch(err) {
            console.log(`Could not login Error: ${err}`);
        }

        console.log('client has successfully loged in!');
    }
}