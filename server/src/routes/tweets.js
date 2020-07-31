const express = require('express');
const handler = require('../services/handler');

const router = express.Router();

router.get('/tweets', handler.process.bind(handler, 'tweets.get'));
router.get('/tweets/count', handler.process.bind(handler, 'tweets.get_count'));

module.exports = router;