


const rData = require(global.config.info.DIR+'/utils/rdata');
const eError = require(global.config.info.DIR+'/utils/error');
const rp = require('request-promise');
const log = require(global.config.info.DIR+'/utils/logger').logger;
const { bluzelle } = require('bluzelle');
let blz;

const main = async () => {
  blz =  await bluzelle({
    public_pem: 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEKmCtkasNL9IDKQOwIPbSS1ch+R0gdFSuQfCm8ut7b/n6X/E+mMxP9ZhWU3cmxf8HWpiwT1faNE2bzfhvx4q3dg==',
    private_pem: 'MHQCAQEEIIxeLo1DMPaQybHBu7kyxnR91c6l1J1AXkrZfIH9+HyXoAcGBSuBBAAKoUQDQgAEKmCtkasNL9IDKQOwIPbSS1ch+R0gdFSuQfCm8ut7b/n6X/E+mMxP9ZhWU3cmxf8HWpiwT1faNE2bzfhvx4q3dg=='
  });
};
main()

exports.getMarkets = async function (ctx) {
  let result = await blz.read('markets')
  if (result == ''){
    ctx.body = new rData(ctx, "1");
  }
  ctx.body = new rData(ctx, "0",JSON.parse(result));
}


async function callAPI(){
  let options = {
    method : 'GET',
    uri : `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd`,
    body : {},
    json: true
  }
  let body = await rp(options);
  try {
    await blz.update('markets',JSON.stringify(body));
  } catch (error) {
    log.error("callApi error:",error)
    await blz.create('markets',JSON.stringify(body));
  }

} 

//every 20 seconds to action callAPI
setInterval(callAPI,20000)
















