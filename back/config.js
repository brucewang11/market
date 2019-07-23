'use strict';
const path = require('path');
let Config = function() {

  let info = {
    DIR: path.join(__dirname,'/'),
    APP_NAME: 'markets',
    APP_DIR: path.join(__dirname,'/app/'),
    LOG_DIR: path.join(__dirname , '/log/'),
    ENV: "dev",
    PORT: 8081,
    API_VERSION: 'v1'
  };
  return info;
};

exports.info = Config()