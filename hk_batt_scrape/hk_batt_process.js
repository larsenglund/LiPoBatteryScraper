var request = require('request');
var fs = require('fs');
// https://github.com/mbostock/d3/wiki/Gallery
var plotly = require('plotly')("englund", "use your own please :)");

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
