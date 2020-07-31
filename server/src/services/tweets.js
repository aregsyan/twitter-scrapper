const ObjectId = require('mongodb').ObjectID;

const MAX_LIMIT = 1000;

async function getTweets (db, d) {
    const {q, sort, limit } = getTweetsParams(d);
    return db.collection('tweets').find(q).sort(sort).limit(limit).toArray();
}

// TODO add parameter checking in validator

function getTweetsParams(d) {
    const q = {};
    let sort = {id:1};
    const limit = +d.limit && +d.limit < MAX_LIMIT ? +d.limit : MAX_LIMIT;
    if(d.topic_id) {
        if(!ObjectId.isValid(d.topic_id)) {
            throw new Error('Topic Id is not valid');
        }
        q.topic_id = new ObjectId(d.topic_id);
    }
    if(d.max_id) q.id = {$lt: d.max_id};
    if(d.since_id) q.id = {$gt: d.since_id};
    if(d.sort) {
        if(+d.sort === 1 || +d.sort === -1) {
            sort.id = +d.sort;
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
    agg.push({$unwind:'$topic'});
    agg.push({$group:{
        _id: '$topic_id',
        tweets_count: {$sum: 1},
        topic: {$first: '$topic'}
        }});
    agg.push({$project: {
        _id: '$_id',
        tweets_count: '$tweets_count',
        name: '$topic.name'
        }});
    return db.collection('tweets').aggregate(agg, {cursor:{}}).toArray();
}

module.exports = {
    getTweets,
    getTweetsByCount
};

