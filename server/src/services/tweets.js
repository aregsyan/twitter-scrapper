const ObjectId = require('mongodb').ObjectID;

const MAX_LIMIT = 1000;

async function getTweets (db, d) {
    const {q, sort, limit } = getTweetsParams(d);
    return db.collection('tweets').find(q).sort(sort).limit(limit).toArray();
}

// TODO add parameter checking in validator

function getTweetsParams(d) {
    const q = {};
    let sort = 1;
    const limit = Number(d.limit) && Number(d.limit) < MAX_LIMIT ? Number(d.limit) : MAX_LIMIT;
    if(d.topic_id) {
        if(!ObjectId.isValid(d.topic_id)) {
            throw new Error('Topic Id is not valid');
        }
        q.topic_id = new ObjectId(d.topic_id);
    }
    if(d.max_id) q.id = {$lt: d.max_id};
    if(d.since_id) q.id = {$gt: d.since_id};
    if(d.sort) {
        if(Number(d.sort) === 1 || Number(d.sort) === -1) {
            sort = d.sort;
        } else {
            throw new Error('Invalid sort parameter. Sort should be 1 or -1');
        }
    }
    return { q, sort, limit };
}

async function getTweetsByCount (db, d) {
    const agg = [];
    agg.push({$lookup: {
            from: 'topics',
            localField: 'topic_id',
            foreignField: '_id',
            as:'topic'
        }});
    agg.push({$unwind:'topic'});
    agg.push({$group:{
        _id: 'topic_id',
        tweets_count: {$sum: 1},
        tweets_ids: {$push: '$_id'},
        topic: {$first: '$topic'}
        }});
    return db.collection('tweets').aggregate(agg, {cursor:{}}).toArray();
}

module.exports = {
    getTweets, getTweetsByCount
};

