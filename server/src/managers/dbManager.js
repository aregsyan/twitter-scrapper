const MongoClient = require('mongodb').MongoClient;
const configs = require('../../config');

class MongoDB {
    constructor() {
        Object.assign(this, configs.mongodb);
        this._db = null;
        this.url = this.getUrl();
    }
    async connect() {
        if(!this._db) {
            try {
                this.client = await MongoClient.connect(this.url, {useNewUrlParser: true});
            } catch (e) {
                console.log(e)
            }
            this._db = this.client.db(this.db);
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
}

const instance = new MongoDB();

module.exports = instance;
