const queryString = require('querystring');
const dbManager = require('../managers/db/dbManager');
const twitterManager = require('../managers/twitterManager');
const scheduler = require('../managers/scheduler');
const config = require('../../config').twitter;

class TwitterScapper {
    constructor() {
        this.rate_limit = config.rate_limit;
        this.twitter = new twitterManager();
        this._topics = {};
        this.pendingRequsts = [];
        this.requestCount = 0;
    }

    async init () {
        this.db = await dbManager.getDB();
    }

    async start () {
        let pendingTopics = await this.getTopics();
        this._topics = this.createTopicsMap(pendingTopics);
        while (true) {
            this.requestCount += pendingTopics.length;
            pendingTopics = await this.doScrap(pendingTopics);
            if(pendingTopics.length === 0 || pendingTopics.length + this.requestCount > this.rate_limit) {
                break;
            }
        }
        await this.updateTopicsDb();
        this.requestCount = 0;
        this.pendingRequsts = [];
        this._topics = {};
        scheduler.schedule(this.start.bind(this));
    }

    async updateTopicsDb() {
        let b = [];
        for(let [k, v] of Object.entries(this._topics)) {
            let u = {updateOne: {
                filter: { _id: v._id},
                update: {$set: {
                    current_max_id: v.current_max_id || 0,
                    start_point: v.start_point,
                    newest_tweet_id: v.newest_tweet_id
                }}
                }};
            b.push(u);
        }
        return this.db.collection('topics').bulkWrite(b);
    }

    createTopicsMap(topics) {
        let m = {};
        topics.forEach(it => m[it.name] = it);
        return m;
    }

    async doScrap (topics) {
        let nextTopics = [];
        this.pendingRequsts = topics.map(async t => {
            const p = this.constructRequestParams(t);
            const res = await this.twitter.get(p);
            this.prepareTopicForNext(t, res, nextTopics);
            return this.processToDb(t, res);
        });
        await Promise.all(this.pendingRequsts);
        return nextTopics;
    }

    prepareTopicForNext(t, r, nArr) {
        if(r.search_metadata.next_results) {
            const next_params = r.search_metadata.next_results.slice(1, r.search_metadata.next_results.length);
            const max_id = Number(queryString.parse(next_params).max_id);
            t.current_max_id = max_id;
        }
        if(r.statuses.length <= 0) {
            if(t.current_max_id && t.current_max_id <= t.newest_tweet_id) {
                delete t.current_max_id;
                nArr.push(this._topics[t.name]);
            }
            t.start_point = t.newest_tweet_id;
        } else {
            if(!t.newest_tweet_id || t.newest_tweet_id < r.statuses[0].id) t.newest_tweet_id = r.statuses[0].id;
            nArr.push(this._topics[t.name]);
        }
    }

    async processToDb (topic, data) {
        if(!data.statuses.length) return;
        data.statuses.forEach(it => it.topic_id = topic._id);
        return this.db.collection('tweets').insertMany(data.statuses);
    }

    constructRequestParams(t) {
        let r = {q: t.name};
        if(t.current_max_id) r.max_id = t.current_max_id;
        if(t.start_point) r.since_id = t.start_point + 1;
        return r;
    }

    async getTopics() {
        return this.db.collection('topics').find().toArray();
    }
}

const instance = new TwitterScapper();

module.exports = instance;

if(require.main === module) {
    instance.init().then(() => instance.start())
        .then(() => {
            console.log('Done');
            process.exit(0);
        })
        .catch(e => {
            console.log(e);
            process.exit(1)
        });
}