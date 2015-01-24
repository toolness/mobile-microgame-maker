var fs = require('fs');
var path = require('path');
var prettyData = require('pretty-data').pd;
var stableStringify = require('json-stable-stringify');
var requirejs = require('requirejs');

var requireConfig = require('../require-config.js');

var BASENAME = process.argv[2];

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

function main(basename) {
  var chunks = [];

  process.stdin.on('data', function(chunk) {
    chunks.push(chunk);
  }).on('end', function() {
    var html = Buffer.concat(chunks).toString('utf-8');
    extractGameData(html, function(err, gameData) {
      if (err) throw err;
      console.log(gameData);
      var blocklyXml = gameData.blocklyXml;
      delete gameData.blocklyXml;
      fs.writeFileSync(basename + '.json',
                       stableStringify(gameData, {space: 2}));
      console.log('wrote', basename + '.json.');
      fs.writeFileSync(basename + '.xml',
                       prettyData.xml(blocklyXml));
      console.log('wrote', basename + '.xml.');
    });
  });
}

if (!module.parent) {
  if (!BASENAME) {
    console.log("usage: " + path.basename(process.argv[1]) +
                " <base-filename>");
    process.exit(1);
  }
  main(BASENAME);
}