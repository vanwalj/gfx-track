'use strict';

const axios = require('axios');
const inquirer = require('inquirer');

const app = require('../');

app.orm.sync()
  .then(() => app.orm.models.Manufacturer.findAll())
  .then(manufacturers =>
    inquirer.prompt([
      { name: 'name', message: 'Nom' },
      { name: 'coreClock', message: 'Core clock' },
      { name: 'boostClock', message: 'Boost clock' },
      { name: 'memoryClock', message: 'Memory clock' },
      { name: 'MPN', message: 'MPN' },
      { name: 'EAN', message: 'EAN' },
      { name: 'cardWidth', message: 'Card width' },
      { name: 'cardLength', message: 'Card length' },
      { name: 'slots', message: 'Slots' },
      { name: 'cooling', message: 'Cooling' },
      { name: 'powerInput', message: 'Power input' },
      { name: 'Manufacturer', message: 'Manufacturer', type: 'list', choices: manufacturers.map(manufacturer => ({ name: manufacturer.name, value: manufacturer })) },
      { name: 'logoUrl', message: 'Logo url' }
    ])
  )
  .then(answers =>
    axios({
      url: answers.logoUrl,
      responseType: 'arraybuffer'
    })
      .then(logo =>
        app.orm.models.File.create({
          content: logo.data,
          contentType: logo.headers['content-type'],
          contentLength: logo.headers['content-length']
        })
      )
      .then(file =>
        app.orm.models.VideoCard.create(answers)
          .tap(videoCard => videoCard.setManufacturer(answers.Manufacturer))
          .tap(videoCard => videoCard.addLogo(file))
      )
  )
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
