var requirejs = require('requirejs');

var requireConfig = require('../require-config.js');

requireConfig.baseUrl = __dirname + '/..';

requirejs.config(requireConfig);

function extractGameData(html, cb) {
  requirejs(['src/import-from-html'], function(importFromHtml) {
    var gameData;
    try {
      gameData = importFromHtml(html);
      if (!gameData) throw new Error("gameData not found");
    } catch (e) {
      cb(e);
    }
    cb(null, gameData);
  });
}

function main() {
  var chunks = [];

  process.stdin.on('data', function(chunk) {
    chunks.push(chunk);
  }).on('end', function() {
    var html = Buffer.concat(chunks).toString('utf-8');
    extractGameData(html, function(err, gameData) {
      if (err) throw err;
      console.log(gameData);
      console.log("TODO: extract blocklyXml from the above blob and " +
                  "write it to a file.");
    });
  });
}

if (!module.parent)
  main();
