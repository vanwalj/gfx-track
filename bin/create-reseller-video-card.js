'use strict';

const Promise = require('bluebird');
const axios = require('axios');
const inquirer = require('inquirer');

const app = require('../');

app.orm.sync()
  .then(() =>
    Promise.all([
      app.orm.models.VideoCard.findAll({
        include: [app.orm.models.Manufacturer]
      }),
      app.orm.models.Reseller.findAll()
    ])
  )
  .spread((videoCards, resellers) =>
    inquirer.prompt([
      { name: 'url', message: 'Url' },
      { name: 'Reseller', message: 'Reseller', type: 'list', choices: resellers.map(reseller => ({ name: reseller.name, value: reseller })) },
      { name: 'VideoCard', message: 'Video card', type: 'list', choices: videoCards.map(videoCard => ({ name: `${ videoCard.Manufacturer.name } - ${videoCard.name}`, value: videoCard })) }
    ])
  )
  .then(answers =>
    app.orm.models.ResellerVideoCard.create({
      url: answers.url,
      ResellerId: answers.Reseller.id,
      VideoCardId: answers.VideoCard.id
    })
  )
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
