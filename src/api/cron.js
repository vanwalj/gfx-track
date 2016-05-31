'use strict';

const jobs = require('./jobs');
const CronJob = require('cron').CronJob;

const probeJob = new CronJob({
  cronTime: '*/1 * * * *',
  onTick: () => {
    console.log('Cron started');
    jobs.probe()
      .then(() => {
        console.log('Cron ended');
      });
  }
});

module.exports = {
  start: () => {
    probeJob.start();
  }
};
