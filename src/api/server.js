'use strict';

const Promise = require('bluebird');
const Koa = require('koa');
const compose = require('koa-compose');
const Router = require('koa-router');
const cors = require('kcors');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const renderer = require('./renderer');

const orm = require('./orm');

const readFileAsync = Promise.promisify(fs.readFile, { context: fs });
const gzipAsync = Promise.promisify(zlib.gzip, { context: zlib });
const server = module.exports = new Koa();
server.use(cors());

const ssrRouter = new Router();
const ssrCache = {};

ssrRouter.get('/', renderer());
ssrRouter.get('/files/:fileId', async ctx => {
  const file = await orm.models.File.findById(ctx.params.fileId);
  ctx.assert(file);
  ctx.set('content-type', file.contentType);
  ctx.body = file.content;
});
ssrRouter.get('/static/:ressource', async ctx => {
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

server.use(ssrRouter.routes());
server.use(ssrRouter.allowedMethods());

const videoCardRouter = new Router({
  prefix: '/video-cards'
});

videoCardRouter.get('/', async ctx => {
  ctx.body = await orm.models.VideoCard.getAll();
});

server.use(videoCardRouter.routes());
server.use(videoCardRouter.allowedMethods());
