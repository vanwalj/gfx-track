'use strict';

const app = require('../');

app.orm.sync({ force: true })
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
