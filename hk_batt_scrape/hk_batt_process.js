var request = require('request');
//var quiche = require('quiche');
// https://github.com/mbostock/d3/wiki/Gallery
var fs = require('fs');
// plot.ly/~englund/0
var plotly = require('plotly')("englund", "ocwj99o160");

var obj = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
console.log(obj.length);

var euro_to_sek = 9.40;

var all_batts = [];

for (var i=0; i<obj.length; i++) {
  for (var j=0; j<obj[i].batts.length; j++) {
    obj[i].batts[j].watthours = obj[i].batts[j].mah * obj[i].lipoconf * 3.7 / 1000;
    obj[i].batts[j].watthourspersek = obj[i].batts[j].watthours / (obj[i].batts[j].price * euro_to_sek);
    obj[i].batts[j].watthourspergram = obj[i].batts[j].watthours / obj[i].batts[j].weight;
    all_batts.push(obj[i].batts[j]);
  }
}

// Sort by watthourspersek and print top 5
all_batts.sort(function(a, b) {
    return b.watthourspersek - a.watthourspersek;
});
fs.writeFileSync('./data_by_watthourspersek.json', JSON.stringify(all_batts, null, 2), 'utf-8');
for (var n=0; n<5; n++) {
  console.log(n + ": " + all_batts[n].watthourspersek + " " + all_batts[n].watthours + "Wh " + (all_batts[n].price*euro_to_sek) + "SEK " + all_batts[n].weight + "g " + all_batts[n].url);
}

// Sort by watthourspergram and print top 5
all_batts.sort(function(a, b) {
    return b.watthourspergram - a.watthourspergram;
});
fs.writeFileSync('./data_by_watthourspergram.json', JSON.stringify(all_batts, null, 2), 'utf-8');
for (var n=0; n<5; n++) {
  console.log(n + ": " + all_batts[n].watthourspergram + " " + all_batts[n].watthours + "Wh " + (all_batts[n].price*euro_to_sek) + "SEK " + all_batts[n].weight + "g " + all_batts[n].url);
}
  
/*
var axis1 = {
  type: "scatter",
  name: "axis1"
};
axis1.x = [];
axis1.y = [];
var axis2 = {
  type: "scatter",
  name: "axis2",
  yaxis: "y2"
};
axis2.x = [];
axis2.y = [];


for (var i=0; i<obj.length; i++) {
  axis1.x.push(obj[i].mah);
  axis2.x.push(obj[i].mah);
  axis1.y.push(obj[i].count);
  axis2.y.push(1000*obj[i].avg_price/obj[i].mah);
}

var data = [axis1, axis2];

var layout = {
  title: "Aliexpress battery data",
  yaxis: {title: "axis1"},
  yaxis2: {
    title: "axis2",
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
*/

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