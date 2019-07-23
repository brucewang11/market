'use strict';

const Router = require('koa-router');
const Market = require('./service/market');
const router = new Router();

router
    .get('/api/v1/getmarkets', Market.getMarkets)
module.exports = router;
