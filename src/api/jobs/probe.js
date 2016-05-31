'use strict';

const Promise = require('bluebird');

const orm = require('../orm');
const extractors = require('../extractors');
const postmark = require("postmark")(process.env.POSTMARK_API_TOKEN);

const sendMail = Promise.promisify(postmark.send, { context: postmark });

const createProbeAndNotify = (resellerVideoCard, latestProbe, { price, inStock }) =>
    orm.models.Probe.create({
      price, inStock,
      probedAt: new Date(),
      ResellerVideoCardId: resellerVideoCard.id
    })
      .then(probe => {
        if (probe.inStock === true && latestProbe.inStock === false) {
          return resellerVideoCard.getVideoCard()
            .then(videoCard => videoCard.getUsers())
            .each(user => sendMail({
              "From": "jordan@telephone-ro.se",
              "To": user.email,
              "Subject": "Une GTX 1080 est en stock !",
              "TextBody": `
                YO, on dirait bien qu'une 1080 vient de passer en stock :o
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
            return probe.update({ probedAt: new Date() });
          })
      )
      .catch(err => console.error(err));
  });
