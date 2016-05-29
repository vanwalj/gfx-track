'use strict';

const axios = require('axios');
const inquirer = require('inquirer');

const app = require('../');

app.orm.sync()
  .then(() =>
    inquirer.prompt([
      { name: 'name', message: 'Nom' },
      { name: 'homeUrl', message: 'Home url' },
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
        app.orm.models.Manufacturer.create({
          name: answers.name,
          homeUrl: answers.homeUrl
        })
          .then(manufacturer => manufacturer.setLogo(file))
      )
  )
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
