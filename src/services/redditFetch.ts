import fetch from 'node-fetch';

type Sort = 'new' | 'hot' | 'top';

interface Options {
    limit?: number;
    time?: string;
    sort?: Sort;
}

interface Post {
    permalink :   string;
    title     :   string;
    url       :   string;
    upVotes   :   number;
    comments  :   number;
}

// fetches posts from reddit
export default class RedditFetch {
    private subreddits: string | string[];
    private options:    Options;

    constructor(subreddits: string | string[], options: Options = {limit: 25, time: 'day', sort: 'top'}) {
        this.subreddits = subreddits;
        this.options = options;

        if(!this.validateURL()) 
            throw Error('All provided URLs must be valid');
    }

    public async get() {
        
        const link = `${typeof this.subreddits === 'string' ? this.subreddits : this.random(this.subreddits)}/${this.options.sort}.json?t=${this.options.time}&limit=${this.options.limit}&sort=${this.options.sort}`;

        const body = await (await fetch(link, { method: 'GET'})).json();
        const randomPost = this.random(body.data.children);
        
        if(!randomPost)
            return null;

        const post: Post = {
            permalink: `https://reddit.com${randomPost.data.permalink}`,
            title: randomPost.data.title,
            url: randomPost.data.url,
            upVotes: randomPost.data.ups,
            comments: randomPost.data.num_comments
        }

        return post;
    }

    private validateURL() {

        const urlRegex = /(https?:\/\/[^\s]+)/;

        if(typeof this.subreddits === 'string' && this.subreddits.match(urlRegex)) 
            return true;

        if(Array.isArray(this.subreddits)) {
            let matches = 0;

            for(const link of this.subreddits) 
                if(link.match(urlRegex))
                    matches++

            if(matches === this.subreddits.length)
                return true;

            return false;
        }

        return false;
    }

    private random(array: any[]): any {
        return array[Math.floor(Math.random() * array.length)];
    }
}