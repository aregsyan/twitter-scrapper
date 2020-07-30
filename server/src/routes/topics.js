const express = require('express');
const processor = require('./processor');

const router = express.Router();

router.post('/topics', processor.process.bind(processor, 'topics.add'));
router.get('/topics', processor.process.bind(processor, 'topics.get'));
router.get('topics/:id', processor.process.bind(processor, 'topics.get'));

module.exports = router;