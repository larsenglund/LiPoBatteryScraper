var request = require('request');
//var quiche = require('quiche');
// https://github.com/mbostock/d3/wiki/Gallery
var fs = require('fs');
var plotly = require('plotly')("englund", "ocwj99o160");

var obj = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
console.log(obj.length);


var count = {
  type: "scatter",
  name: "count"
};
count.x = [];
count.y = [];
var price = {
  type: "scatter",
  name: "price",
  yaxis: "y2"
};
price.x = [];
price.y = [];


for (var i=0; i<obj.length; i++) {
  count.x.push(obj[i].mah);
  price.x.push(obj[i].mah);
  count.y.push(obj[i].count);
  price.y.push(1000*obj[i].avg_price/obj[i].mah);
}

var data = [count, price];

var layout = {
  title: "Aliexpress battery data",
  yaxis: {title: "count"},
  yaxis2: {
    title: "price (USD)",
    titlefont: {color: "rgb(148, 103, 189)"},
    tickfont: {color: "rgb(148, 103, 189)"},
    overlaying: "y",
    side: "right"
  }
};

var graphOptions = {layout: layout, filename: "basic-line", fileopt: "overwrite"};

plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});

/*var chart = quiche('line');
//chart.setWidth(10000);
//chart.setHeight(1000);
chart.setTitle('Aliexpress Batteries');
chart.addData([3000, 2900, 1500], 'Blah', '008000');
chart.addData([1000, 1500, 2000], 'Asdf', '0000FF');
//chart.addAxisLabels('x', ['1800', '1900', '2000']);
chart.setAutoScaling();
//chart.setTransparentBackground();
chart.setLegendBottom(); // Put legend at bottom

var imageUrl = chart.getUrl(true); // First param controls http vs. https
console.log(imageUrl);

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download(imageUrl, 'google.png', function(){
  console.log('done');
});
*/