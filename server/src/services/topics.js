const validator = require('./validator/topics');
const utils = require('../lib/utils');
const ObjectId = require('mongodb').ObjectID;

// needs to add validation layer
async function addTopic (db, d) {
    const { error, value } = validator.addTopic(d);
    if(error) {
        throw new Error(`Validation error: ${error}`);
    }
    const exist = await utils.checkDataExistence(db, 'topics', value);
    if(exist) {
        throw new Error('Specified Data already exists');
    }
    const obj = {...value, start_point:0, newest_tweet_id: 0, current_max_id: 0};
    const ins = await db.collection('topics').insert(obj);
    return {_id: ins.insertedIds[0], ...value}
}

async function getTopics (db, d) {
    const q = {};
    if(d._id) {
        if(!ObjectId.isValid(d._id)) {
            throw new Error('ObjectId is not valid');
        }
        q._id = new ObjectId(d._id);
    }
    return db.collection('topics').find(q).toArray();
}

module.exports = {
    addTopic, getTopics
};

