// http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

//var request = require('request');
var request = require('sync-request'); 
var cheerio = require('cheerio');
var util = require('util');
const fs = require('fs');


var scrape_to = 10000;
console.log("Scraping!");
var mah_data = [];
for (var mah=10; mah<scrape_to; mah+= 10) {
  var url = 'http://www.aliexpress.com/wholesale?shipCountry=SE&SearchText='+mah+'mah&exception=charger&isFreeShip=y&SortType=price_asc';
  var res = request('GET', url);
  //console.log(res.getBody('utf-8'));
  
  var obj = {};
  obj.mah = mah;
  obj.prices = [];

  $ = cheerio.load(res.getBody('utf-8'));
  obj.count = $('.result-overview .search-count').text().trim().replace(/,/g , "");
  console.log(mah + ',' + obj.count);

  var items = $('#hs-list-items .item');
  for (var i=0; i<Math.min(items.length, 5); i++) {
    var price_parts = $(items[i]).find('.price .value').text().trim().split(" ");
    obj.title = $(items[i]).find('.product').attr('title');
    obj.prices[i] = parseFloat(price_parts[1].replace(/\$/g , ""));
  }
  mah_data.push(obj);
}

var n = 0;
for (var mah=10; mah<scrape_to; mah+= 10) {
  var avg = 0;
  for (var i=1; i<4; i++) { // Take average of 1,2,3 (skipping 0)
    avg += mah_data[n].prices[i];
  }
  mah_data[n].avg_price = avg/3;
  n++;
}
//console.log(util.inspect(mah_data, {depth:12}));
//fs.writeFileSync('./data.json', util.inspect(mah_data, {depth:12}) , 'utf-8');
fs.writeFileSync('./data.json', JSON.stringify(mah_data, null, 2), 'utf-8');

