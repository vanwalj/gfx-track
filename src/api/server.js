'use strict';

const Promise = require('bluebird');
const Koa = require('koa');
const compose = require('koa-compose');
const Router = require('koa-router');
const cors = require('kcors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const bodyParser = require('koa-bodyparser');
const renderer = require('./renderer');

const orm = require('./orm');

const readFileAsync = Promise.promisify(fs.readFile, { context: fs });
const gzipAsync = Promise.promisify(zlib.gzip, { context: zlib });
const server = module.exports = new Koa();
server.use(cors());

const baseRouter = new Router();
const ssrCache = {};

baseRouter.post('/register',
  bodyParser(),
  async ctx => {
    const { email, videoCardIds } = ctx.request.body;
    ctx.assert(email, videoCardIds, 400);
    let user = await orm.models.User.findOne({ email });
    if (!user) {
      user = await orm.models.User.create({ email });
    }
    await user.setVideoCards(videoCardIds);
    ctx.status = 204;
  }
);

baseRouter.get('/unregister',
  async ctx => {
    ctx.assert(ctx.request.query.email, 400);
    const user = await orm.models.User.findOne({ email: ctx.request.query.email });
    ctx.assert(user, 404);
    await user.destroy();
    ctx.body = 'Adios :\'( !';
  }
);

baseRouter.get('/files/:fileId', async ctx => {
  const file = await orm.models.File.findById(ctx.params.fileId);
  ctx.assert(file, 404);
  ctx.set('content-type', file.contentType);
  ctx.body = file.content;
});

baseRouter.get('/static/:ressource', async ctx => {
  if (ssrCache[ctx.params.ressource]) {
    if (ssrCache[ctx.params.ressource].exist) {
      if (ctx.acceptsEncodings('gzip') === 'gzip') {
        ctx.body = ssrCache[ctx.params.ressource].gzip;
        ctx.set('content-encoding', 'gzip');
      } else {
        ctx.body = ssrCache[ctx.params.ressource].file;
      }
    } else {
      ctx.status = 404;
    }
  } else {
    try {
      const file = await readFileAsync(path.join(__dirname, '../app/dist', ctx.params.ressource));
      const gzip = await gzipAsync(file);
      ssrCache[ctx.params.ressource] = {
        file,
        gzip,
        exist: true
      };
      if (ctx.acceptsEncodings('gzip') === 'gzip') {
        ctx.body = gzip;
        ctx.set('content-encoding', 'gzip');
      } else {
        ctx.body = file;
      }
    } catch (e) {
      ssrCache[ctx.params.ressource] = { exist: false };
    }
  }
});

server.use(baseRouter.routes());
server.use(baseRouter.allowedMethods());

const videoCardRouter = new Router({
  prefix: '/video-cards'
});

videoCardRouter.get('/', async ctx => {
  ctx.body = await orm.models.VideoCard.findAll({
    include: [
      { model: orm.models.File, as: 'Logos', attributes: ['id', 'contentType', 'url']},
      { model: orm.models.Manufacturer },
      { model: orm.models.ResellerVideoCard, include: [
        { model: orm.models.Reseller },
        { model: orm.models.Probe, limit: 1, order: [['updatedAt', 'DESC']] }
      ] }
    ]
  });
});

server.use(videoCardRouter.routes());
server.use(videoCardRouter.allowedMethods());

// In case no route match, render react and let the front router handle 404
server.use(renderer());
