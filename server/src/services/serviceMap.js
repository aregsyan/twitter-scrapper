const topics = require('./topics');
const tweets = require('./tweets');

// TODO add validation schemas here

module.exports = {
    'topics.get': topics.getTopics,
    'topics.add': topics.addTopic,
    'tweets.get': tweets.getTweets,
    'tweets.get_count': tweets.getTweetsByCount
};