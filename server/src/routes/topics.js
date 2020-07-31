const express = require('express');
const handler = require('../services/handler');

const router = express.Router();

router.post('/topics', handler.process.bind(handler, 'topics.add'));
router.get('/topics', handler.process.bind(handler, 'topics.get'));
router.get('/topics/:_id', handler.process.bind(handler, 'topics.get'));

module.exports = router;