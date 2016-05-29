'use strict';

const Promise = require('bluebird');
const CronJob = require('cron').CronJob;

const orm = require('./orm');
const extractors = require('./extractors');

const createProbeAndNotify = (resellerVideoCard, latestProbe, { price, inStock }) =>
    orm.models.Probe.create({
      price, inStock
    })
      .then(probe => probe.setResellerVideoCard(resellerVideoCard))
  // TODO Notify users
  ;

const job = new CronJob({
  cronTime: '*/5 * * * *',
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
            orm.models.Probe.findOne({
              where: { ResellerVideoCardId: resellerVideoCard.id },
              order: [['updatedAt', 'DESC']]
            })
              .then(probe => {
                if (!probe || probe.price !== price || probe.inStock !== inStock) {
                  return createProbeAndNotify(resellerVideoCard, probe, { price, inStock })
                }
                return probe.update();
              })
          )
          .catch(err => console.error(err));
      })
  }
});

module.exports = job;
