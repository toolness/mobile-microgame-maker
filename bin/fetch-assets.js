var fs = require('fs');
var request = require('request');
var spreadsheetToAssets = require('../src/spreadsheet-to-assets.js');

function download(absoluteURL, relativeURL) {
  request(absoluteURL).on('response', function(res) {
    if (res.statusCode != 200)
      throw new Error('got HTTP ' + res.statusCode + ' for ' +
                      absoluteURL);
    res.on('end', function() {
      console.log('fetched', relativeURL);
    }).pipe(fs.createWriteStream('assets/' + relativeURL));
  });
}

spreadsheetToAssets(function(gameData) {
  gameData.sounds.forEach(function(sound) {
    var absoluteURL = sound.url;
    var relativeURL = 'sounds/' + absoluteURL.match(/\/sounds\/(.+)$/)[1];

    sound.url = relativeURL;
    download(absoluteURL, relativeURL);
  });

  gameData.spritesheets.forEach(function(spritesheet) {
    var absoluteURL = spritesheet.url;
    var relativeURL = 'img/' + absoluteURL.match(/\/img\/(.+)$/)[1];

    spritesheet.url = relativeURL;
    download(absoluteURL, relativeURL);
  });

  fs.writeFileSync('assets.json', JSON.stringify(gameData, null, 2));
  console.log('wrote assets.json.');
});
