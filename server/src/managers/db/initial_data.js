const dbManager = require('./dbManager');

const defaultParams = {
    newest_tweet_id: 0,
    start_point: 0,
    current_max_id: 0
};

async function initialData() {
    const initialData = [
        {name: 'Lady Gaga'},
        {name: 'Docker'},
        {name: 'Esports'},
        {name: 'Led Zeppelin'}
    ];
    let insertionData = initialData.map(it => Object.assign(it, defaultParams));
    const db = await dbManager.getDB();
    return db.collection('topics').insertMany(insertionData);
}

module.exports = {
    run: initialData
}