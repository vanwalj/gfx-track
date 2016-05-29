'use strict';

const Promise = require('bluebird');
const CronJob = require('cron').CronJob;

const orm = require('./orm');
const extractors = require('./extractors');

const job = new CronJob({
  cronTime: '*/1 * * * *',
  onTick: () => {
    Promise.try(() => orm.models.ResellerVideoCard.findAll({
      include: [
        { model: orm.models.Reseller }
      ]
    }))
      .each(resellerVideoCard => {
        const extractor = new extractors[resellerVideoCard.Reseller.slug](resellerVideoCard.url);
        return extractor.extract()
          .then(({ price, inStock }) =>
            orm.models.Probe.create({
              price, inStock
            })
              .then(Probe => Probe.setResellerVideoCard(resellerVideoCard))
          )
          .catch(err => console.error(err));
      })
  }
});

module.exports = job;
