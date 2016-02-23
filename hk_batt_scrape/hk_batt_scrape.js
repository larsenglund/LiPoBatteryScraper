// http://blog.miguelgrinberg.com/post/easy-web-scraping-with-nodejs

//var request = require('request');
var request = require('sync-request'); 
var cheerio = require('cheerio');
var util = require('util');
const fs = require('fs');

// curPage=1,2,etc
// LiPoConfig = 1(S), 2(S), etc

//(http://www.hobbyking.com/hobbyking/store/uh_listCategoriesAndProducts.asp?idCategory=86&LiPoConfig=1&sortlist=&CatSortOrder=desc)
//http://www.hobbyking.com/hobbyking/store/uh_listCategoriesAndProducts.asp?cwhl=XX&pc=&idCategory=86&curPage=1&v=&sortlist=&sortMotor=&LiPoConfig=1&CatSortOrder=desc
//http://www.hobbyking.com/hobbyking/store/uh_listCategoriesAndProducts.asp?cwhl=XX&pc=&idCategory=86&curPage=2&v=&sortlist=&sortMotor=&LiPoConfig=1&CatSortOrder=desc

var scrape_to = 10000;
console.log("Scraping!");
var raw_data = [];

for (var lipoconf=1; lipoconf<11; lipoconf++) {
  var obj = {};
  obj.lipoconf = lipoconf;
  obj.batts = [];
  obj.count = 0;

  var page = 1;
  do {
    var url = 'http://www.hobbyking.com/hobbyking/store/uh_listCategoriesAndProducts.asp?cwhl=XX&pc=&idCategory=86&curPage='+page+'&v=&sortlist=&sortMotor=&LiPoConfig='+lipoconf+'&CatSortOrder=desc';
    var res = request('GET', url);
    $ = cheerio.load(res.getBody('utf-8'));

    // TODO: grab rows here
    var items = $('.zeroLineHeight');
    console.log("Page " + page + " contained " + items.length + " rows");
    if (items.length < 2) {
      break;
    }
    
    obj.count += items.length;
    
    for (var i=1; i<items.length; i++) {
      var battobj = {};
      
      var price = $(items[i]).find('font:contains("EU")').text().trim();
      var weight_parts = $(items[i]).find('div:contains("Weight :")').text().trim().split(" ");
      var mah_url1 = $(items[i]).find('a:contains("mAh")');
      var mah_url2 = $(items[i]).find('a:contains("mah")');
      var mah_url = mah_url1;
      if (mah_url.text().trim() == "") {
        mah_url = mah_url2;
      }
      // http://www.hobbyking.com/hobbyking/store/__18791__Turnigy_nano_tech_130mah_1S_25C_Lipo_Nine_Eagles_style_T2_Twin_Rail_.html
      //console.log('http://www.hobbyking.com/hobbyking/store/' + mah_url.attr('href'));
      
      battobj.url = 'http://www.hobbyking.com/hobbyking/store/' + mah_url.attr('href');
      
      var mah_parts = mah_url.text().trim().split(" ");
      var mah;
      for (var j=0; j<mah_parts.length; j++) {
        if (mah_parts[j].toLowerCase().indexOf('mah') != -1) {
          mah = mah_parts[j];
          break;
        }
      }
      //var mah_url = $(items[i]).filter(function(){ return $(this).text().toLowerCase().indexOf('mah') != -1;});
      console.log("'" + price + "' : '" + weight_parts[2] + "' : " + mah);
      battobj.price = price.replace(/[^\d.-]/g, '');
      battobj.weight = weight_parts[2].replace(/[^\d.-]/g, '');
      battobj.mah = mah.replace(/[^\d.-]/g, '');
      //console.log("'" + mah + "'");
      //obj.title = $(items[i]).find('.product').attr('title');
      //obj.prices[i] = parseFloat(price_parts[1].replace(/\$/g , ""));
      
      obj.batts.push(battobj);
    }

    page ++;
  } while (true);
  //console.log(res.getBody('utf-8'));
  
  raw_data.push(obj);
}
/*
var n = 0;
for (var mah=10; mah<scrape_to; mah+= 10) {
  var avg = 0;
  for (var i=1; i<4; i++) { // Take average of 1,2,3 (skipping 0)
    avg += mah_data[n].prices[i];
  }
  mah_data[n].avg_price = avg/3;
  n++;
}
*/
//console.log(util.inspect(mah_data, {depth:12}));
//fs.writeFileSync('./data.json', util.inspect(mah_data, {depth:12}) , 'utf-8');
fs.writeFileSync('./data.json', JSON.stringify(raw_data, null, 2), 'utf-8');

