const Logger = require('mini-logger');
const path = require('path');
const config = global.config.info;
const jsonFormat = require("json-format");

var jsonOption = {
  type: 'space',
  size: 2
}

let logger = Logger({
  dir: path.join(config.DIR, 'log'),
  categories: [ 'error', 'errorcode' ,'info' ],
  format: '[{category}.]YYYY-MM-DD[.log]',
  stdout: true,
  timestamp: true
});

logger._options.categories.forEach(function(key){
  let fn = logger[key];
  logger[key] = function(){
    let err = new Error().stack;
    let reg = new RegExp("at.*?" +global.config.info.DIR + ".*?\\:.*?\\:", "g");
    let paths = err.match(reg);
    let path = paths[1].replace("("+global.config.info.DIR, '').replace(":",' ')+"\n";
    for(let j=0; j<arguments.length; j++){
      if(Object.prototype.toString.call(arguments[j]) === "[object Object]"){
        arguments[j] = jsonFormat(arguments[j], jsonOption);
      }
    }
    Array.prototype.unshift.call(arguments,path)
    fn.apply(this,arguments);
  }
});

exports.logger = logger;

let httplogger = Logger({
  dir: path.join(config.DIR, 'log'),
  categories: [ 'http' ],
  format: '[{category}.]YYYY-MM-DD[.log]',
  timestamp: true
});

exports.httpLogger = async function(ctx, next){
    await next();
    if(ctx.header["x-real-ip"]!=null){
      ctx.request.ip = ctx.header["x-real-ip"];
    }
    console.log(new Date(), '[http]', ctx.request.ip, ctx.method, ctx.url, ctx.header["accept-language"], ctx.response.status, ctx.response.message);
    httplogger.http(ctx.request.ip, ctx.method, ctx.url, ctx.header["accept-language"], ctx.header["user-agent"], ctx.response.status, ctx.response.message);
    
}


