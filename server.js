'use strict';
let config = require('./config');

global.config = config;
Object.freeze(global.config);

const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const logger = require(global.config.info.DIR + 'utils/logger').logger;
const httpLogger = require(global.config.info.DIR + 'utils/logger').httpLogger;







require('colors');
const app = new koa();

app.use(httpLogger);


// bodyParser for json and form
app.use(bodyParser({
  jsonLimit:'5mb',
  textLimit:'5mb',
  formLimit:'5mb'
}));



app.use(async function(ctx, next){
  try{
    await next();
  }catch (err){
    if (typeof err.code === 'number') {
      try{
        let state = {
          method: err.ctx.method,
          url: err.ctx.url,
          language: err.ctx.header['content-language'],
          body: err.ctx.request.body,
          ip: err.ctx.request.ip
        }
        logger.errorcode("errorCode:",err.code, 
        "errorMessage:", err.message, 
        "errorState:", state);
      }catch(e){
        logger.error(e);
      }
      ctx.status = 200;
      ctx.body = {
        code: err.code,
        message: err.message
      }
    } else {
      logger.error(err);
      ctx.status = 500;
      ctx.body = {
        detail : 'Internal Server Error.'
      } 
    }
  }
});


// hang router
router.use("", require(config.info.APP_DIR).routes());
app.use(router.routes())
  .use(router.allowedMethods({throw:true}));


let port = config.info.PORT || 3000;
if(config.info.ENV === 'test'){
  module.exports = app;
}else{
  app.listen(port);
  console.info('Application running in'.green,config.info.ENV.red,'environment.'.green);
  console.info('You can now visit '.green +
               ('http://localhost:'+config.info.PORT).underline.blue +
               ' via your browser.'.green);
}

