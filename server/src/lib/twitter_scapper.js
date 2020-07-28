const axios = require('axios');
const queryString = require('querystring');
const dbManager = require('../managers/dbManager');
const twitterManager = require('../managers/twitterManager');

class TwitterScapper {
    constructor() {
        this.twitter = new twitterManager();
        this._topics = {};
        this.pendingRequsts = [];
        this.requestCount = 0;
    }

    async init () {
        this.db = await dbManager.getDB()
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
        this.requestCount = 0;
        this.pendingRequsts = [];
        this._topics = {}
        await this.updateTopicsDb();
    }

    async updateTopicsDb() {
        let b = [];
        for(let [k, v] of Object.entries(this._topics)) {
            let u = {updateOne: {
                filter: { _id: v._id},
                update: {$set: {since_id: v.since_id}}
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
            this.prepeareTopicForNext(t, res, nextTopics);
            return this.processToDb(t, res);
        });
        await Promise.all(this.pendingRequsts);
        return nextTopics;
    }

    prepeareTopicForNext(t, r, nArr) {
        this._topics[t.name].since_id = r.search_metadata.since_id;
        if(r.search_metadata.count > 0) nArr.push(this._topics[t.name]);
    }

    async processToDb (topic, data) {
        data.statuses.forEach(it => it.topic_id = topic._id);
        return this.db.collection('tweets').insertMany(data.statuses);
    }

    constructRequestParams(t) {
        let r = {q: t.name};
        if(t.since_id) r.since_id = t.since_id;
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