const validator = require('./validator/topics');
const utils = require('../lib/utils');
const ObjectId = require('mongodb').ObjectID;

// needs to add validation layer
async function addTopic (db, d) {
    const { e, v } = validator.addTopic(d);
    if(e) {
        throw new Error(`Validation error: ${e}`);
    }
    const exist = await utils.checkDataExistence(db, 'topics', v);
    if(exist) {
        throw new Error('Specified Data already exists');
    }
    const ins = await db.collection('topics').insert(d);
    return {_id: ins.insertedIds[0], ...v}
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

