import ns from 'node-schedule';
import { redis } from './database';

export default class Scheduler {
    public queue: Map<string, ns.Job>;

    constructor() {
        this.queue = new Map();

        //this.load();
    }

    public async set(id: string, time: string, fn: ns.JobCallback) {
        
        const date = new Date(Date.now() + time);
        const job = ns.scheduleJob(date, async () => {
            await redis.hdel('scheduler', id);
            fn(date);
        });
        
        const obj = {
            time: date.toString(),
            job: job.toString(),
            fn: fn.toString()
        }

        const exists = await redis.hexists('scheduler', id);

        if(!exists) 
            await redis.hset('scheduler', id, JSON.stringify(obj));

        this.queue.set(id, job);
    }

    public async cancel(id: string) {
        await redis.hdel('scheduler', id);
        this.queue.get(id)?.cancel();
        this.queue.delete(id);
    }

    public async get(id: string) {
        return await redis.hget('scheduler', id);
    }

    private async load() {
       const entries = await redis.hgetall('scheduler');
       
       for(const [key, value] of Object.entries(entries)) {
           const obj = JSON.parse(value);
           const job = eval(obj.job);
           const fn = eval(obj.fn);
           const date = new Date(obj.time);
           
           ns.scheduleJob(date, async () => {
               await redis.hdel('scheduler', key);
               fn(date);
           });

           this.queue.set(key, job);
       }
    }
}