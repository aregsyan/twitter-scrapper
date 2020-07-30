const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('../managers/db/dbManager');
const twitterScrapper = require('../lib/twitter_scapper');
const config = require('../../config');

//routers
const topics = require('../routes/topics');
const tweets = require('../routes/tweets');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.status(200).send('hello'));
app.use('/api', topics);
app.use('/api', tweets);

dbManager.connect().then(async () => {
    app.listen(config.app.port, () => console.log('App listening on port 3000!'));
    await twitterScrapper.init();
    twitterScrapper.start();
});
