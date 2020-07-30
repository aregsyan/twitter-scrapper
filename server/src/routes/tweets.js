const express = require('express');
const processor = require('./processor');

const router = express.Router();

router.get('/tweets', processor.process.bind(processor, 'tweets.get'));
router.get('/tweets/count', processor.process.bind(processor, 'tweets.get_count'));

module.exports = router;