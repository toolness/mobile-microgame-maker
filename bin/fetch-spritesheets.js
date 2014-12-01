var fs = require('fs');
var request = require('request');
var s2s = require('../src/spreadsheet-to-spritesheet.js');

s2s(function(gameData) {
  gameData.spritesheets.forEach(function(spritesheet) {
    var absoluteURL = spritesheet.url;
    var filename = absoluteURL.match(/\/img\/(.+)$/)[1];
    var relativeURL = 'img/' + filename;
    var file;

    spritesheet.url = relativeURL;

    request(absoluteURL).on('response', function(res) {
      if (res.statusCode != 200)
        throw new Error('got HTTP ' + res.statusCode + ' for ' +
                        absoluteURL);
      file = fs.createWriteStream('assets/' + relativeURL);
      res.on('end', function() {
        console.log('fetched', filename);
      }).pipe(file);
    });
  });

  fs.writeFileSync('spritesheets.json', JSON.stringify(gameData, null, 2));
  console.log('wrote spritesheets.json.');
});
