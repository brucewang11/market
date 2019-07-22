'use strict';
const en_us = require('../static/lang/en_us.json');
const zh_cn = require('../static/lang/zh_cn.json');


const obj = {
  'en' : en_us,
  'zh_cn' : zh_cn
}

class ExtendableError extends Error {
  constructor(ctx, code, msg) {
    let lang = ctx.header['content-language'] || 'en';
    super(obj[lang][code]);

    Object.defineProperty(this, 'code', {
      enumerable : false,
      value : code
    })

    Object.defineProperty(this, 'ctx', {
      enumerable : false,
      value : ctx
    })

    // extending Error is weird and does not propagate `message`
    Object.defineProperty(this, 'message', {
      enumerable : false,
      value : msg?obj[lang][code]+msg+obj[lang][code+1]:obj[lang][code],
      writable : true
    });

    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(this, this.constructor);
      return;
    }

    Object.defineProperty(this, 'stack', {
      enumerable : false,
      value : (new Error(obj[lang][code])).stack
    });
  }
}

module.exports = ExtendableError;


