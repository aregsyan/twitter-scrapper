const MongoClient = require('mongodb').MongoClient;
const configs = require('../../../config');
const versions = require('./versions');

class MongoDB {
    constructor() {
        Object.assign(this, configs.mongodb);
        this._db = null;
        this.url = this.getUrl();
        this.onStart = true;
    }
    async connect() {
        if(!this._db) {
            try {
                this.client = await MongoClient.connect(this.url, {useNewUrlParser: true});
            } catch (e) {
                console.log(e)
            }
            this._db = this.client.db(this.db);
            if(this.onStart) {
                await this.trackVersioning();
                this.onStart = true;
            }
        }
    }
    async getDB() {
        if(!this.verifyDb()) {
            await this.connect();
        }
        return this._db;
    }

    verifyDb() {
        return this._db && this.client && this.client.isConnected();
    }
    getUrl() {
        if(!this.user || !this.password || !this.host || !this.db) {
            return `mongodb://db:27017/twitter-scrapper`;
        }
        return `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`;
    }

    async trackVersioning() {
        const db_versions = await this._db.collection('versions').find().toArray();
        for(let [k, v] of Object.entries(versions)) {
            if(!db_versions.find(it => it.version === k)) {
                let f = require(`./${v}`);
                await f.run();
                await this._db.collection('versions').insert({version: k});
            }
        }
    }
}

const instance = new MongoDB();

module.exports = instance;
