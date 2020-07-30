const CronJob = require('cron').CronJob;
const config = require('../../config');

class Scheduler {
    constructor() {
        this.rate_interval = config.twitter.rate_interval;
    }

    schedule(cb) {
        const t = new Date().getTime() + this.rate_interval * 1000;
        if(this.job) this.job.stop();
        this.job = new CronJob(new Date(t), cb);
        this.job.start();
    }
}

const instance = new Scheduler();

module.exports = instance;