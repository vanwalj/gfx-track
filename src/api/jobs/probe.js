'use strict';

const Promise = require('bluebird');
const Twitter = require('twitter');
const numeral = require('../../app/src/services/numeral');

const orm = require('../orm');
const extractors = require('../extractors');
const postmark = require("postmark")(process.env.POSTMARK_API_TOKEN);
const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const sendMail = Promise.promisify(postmark.send, { context: postmark });
const tweet = (status) => new Promise((resolve, reject) => {
  twitterClient.post('statuses/update', { status }, (err, tweet) => {
    if (err) return reject(err);
    return resolve(tweet);
  });
});

const createProbeAndNotify = (resellerVideoCard, latestProbe, { price, inStock }) =>
    orm.models.Probe.create({
      price, inStock,
      probedAt: new Date(),
      ResellerVideoCardId: resellerVideoCard.id
    })
      .then(probe => {
        if (!latestProbe) {
          tweet(`Les ${ resellerVideoCard.VideoCard.Manufacturer.name } ${ resellerVideoCard.VideoCard.name } sont maintenant listés chez ${ resellerVideoCard.Reseller.name } ! ${ resellerVideoCard.url }`);
        }
        if (latestProbe && latestProbe.price > probe.price) {
          tweet(`Baisse de prix sur les ${ resellerVideoCard.VideoCard.Manufacturer.name } ${ resellerVideoCard.VideoCard.name } chez ${ resellerVideoCard.Reseller.name } ancien prix: ${ numeral(latestProbe.price).format('0,0[.]00 $') }, nouveau prix: ${ numeral(probe.price).format('0,0[.]00 $') }! ${ resellerVideoCard.url }`);
        }
        if (probe.inStock === true && (!latestProbe || latestProbe.inStock === false)) {
          return tweet(`Les ${ resellerVideoCard.VideoCard.Manufacturer.name } ${ resellerVideoCard.VideoCard.name } viennent de passer en stock chez ${ resellerVideoCard.Reseller.name } ! ${ resellerVideoCard.url }`)
            .catch(e => console.error(e, 'tweet error'))
            .then(() => resellerVideoCard.VideoCard.getUsers())
            .each(user => sendMail({
              "From": "jordan@telephone-ro.se",
              "To": user.email,
              "Subject": `${ resellerVideoCard.VideoCard.Manufacturer.name } ${ resellerVideoCard.VideoCard.name } en stock chez ${ resellerVideoCard.Reseller.name } !`,
              "TextBody": `
                Yo, on dirait bien que les ${ resellerVideoCard.VideoCard.Manufacturer.name } ${ resellerVideoCard.VideoCard.name } viennent de passer en stock chez ${ resellerVideoCard.Reseller.name } !

                ${ resellerVideoCard.url }

                Se desabo https://gfx-track.herokuapp.com/unregister?email=${ user.email } :(
              `,
              "Tag": "GTX 1080"
            })
              .catch(e => console.error(e))
            );
        }
      })
  ;

module.exports = () =>
  Promise.try(() => orm.models.ResellerVideoCard.findAll({
    include: [
      { model: orm.models.Reseller},
      { model: orm.models.VideoCard, include: [
        { model: orm.models.Manufacturer }
      ] }
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
            return probe.update({ probedAt: new Date() });
          })
      )
      .catch(err => console.error(err));
  });
