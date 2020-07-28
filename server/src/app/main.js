const express = require('express');
const bodyParser = require('body-parser');
const dbManager = require('../managers/dbManager');
const config = require('../../config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.status(200).send('hello'))
dbManager.connect().then(() => {
    app.listen(config.app.port, () => console.log('App listening on port 3000!'));
});

