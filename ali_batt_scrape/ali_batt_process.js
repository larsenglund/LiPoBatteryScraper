var request = require('request');
var fs = require('fs');
// https://github.com/mbostock/d3/wiki/Gallery
var plotly = require('plotly')("englund", "use your own please :)");

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
