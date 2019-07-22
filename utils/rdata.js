'use strict';
const en_us = require('../static/lang/en_us.json');
const zh_cn = require('../static/lang/zh_cn.json');

const obj = {
  'en' : en_us,
  'zh_cn' : zh_cn
}
class rData {

  constructor(ctx, message, data) {
    let lang = ctx.header['content-language'] || 'en';
    this.code = 0;
    this.message = obj[lang][message];
    this.data = data;
  }
}

module.exports = rData;


