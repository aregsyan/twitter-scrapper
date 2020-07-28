module.exports = {
    mongodb: {
        host: process.env.MONGODB_HOST || '127.0.0.1',
        port: process.env.MONGODB_PORT || '27017',
        user: process.env.MONGODB_USER || 'rwusr',
        password: process.env.MONGODB_PASSWORD || 'password',
        db: process.env.MONGODB_DB || 'twitter-scrapper'
    },
    twitter: {
        url: process.env.TWITTER_URL || 'https://api.twitter.com/1.1/search/tweets.json',
        rate_limit: 450,
        rate_interval: 900,
        bearer_token: process.env.TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAABaGQEAAAAAyFehQ4g03gTt1V2sobKsLSwd1Ks%3DY3ZlWjoaqc3Qzsso1oz7zLyzJCeNXm1flIK5WJGQ0fb0oyFzDF'
    },
    app: {
        port: process.env.PORT || '3000'
    }
}