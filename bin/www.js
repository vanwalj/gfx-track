'use strict';

const app = require('../');

app.orm.sync({ force: true })
  .then(() => app.jobs.start())
  .then(() => app.server.listen(process.env.PORT))
  .catch(err => console.error(err));
