'use strict';

const Koa = require('koa');
const compose = require('koa-compose');
const Router = require('koa-router');
const cors = require('kcors');

const orm = require('./orm');

const server = module.exports = new Koa();
const videoCardRouter = new Router({
  prefix: '/video-cards'
});

videoCardRouter.get('/', async ctx => {
  ctx.body = await orm.models.VideoCard.getAll();
});

server.use(cors());
server.use(videoCardRouter.routes());
server.use(videoCardRouter.allowedMethods());
