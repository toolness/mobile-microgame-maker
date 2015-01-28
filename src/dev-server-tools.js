define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Export = require('./export');
  var PhaserState = require('./phaser-state');
  var GameData = require('./game-data');
  var Blockly = require('./phaser-blocks');

  var EXAMPLES = require('examples/examples');

  return {
    regenerateAllExamples: function() {
      var self = this;
      var examplesLeft = EXAMPLES.slice();
      var importNextGame = function() {
        var example = examplesLeft.pop();

        console.log("importing examples/" + example);
        self._importFromFilesystem(example, function(gameData) {
          console.log("exporting examples/" + example);
          self._exportToFilesystem(example, gameData, function() {
            if (examplesLeft.length == 0)
              alert("All examples regenerated!");
            else
              importNextGame();
          });
        });
      };

      importNextGame();
    },
    _importFromFilesystem: function(name, cb) {
      Export.fromUrl('examples/' + name + '.html', function(err, gameData) {
        if (err) {
          console.log(err);
          return alert("Error! Check the browser console.");
        }
        if (gameData == null)
          return alert("No game data found!");
        cb(gameData);
      });
    },
    importFromFilesystem: function(name, cb) {
      name = window.prompt("Enter name of example to import.", name);
      if (!name) return;
      this._importFromFilesystem(name, cb);
    },
    _exportToFilesystem: function(name, gameData, cb) {
      var originalBaseURL = gameData.baseURL;

      gameData = React.addons.update(gameData, {
        name: {$set: name},
        baseURL: {$set: '../assets/'}
      });

      var blocklyInfo = Blockly.Phaser.generateJs(gameData);

      gameData = GameData.minimize(gameData, blocklyInfo.soundsUsed);

      var stateJs = PhaserState.Generators.createState({
        minimizeGameData: false,
        gameData: gameData,
        blocklyInfo: blocklyInfo
      });
      var html = Export.toHtml(gameData, {
        stateJs: stateJs,
        encourageRemix: true,
        gameDataForRemix: name + '.json',
        baseAssetURL: gameData.baseURL,
        baseCreatorURL: '../',
        scripts: ['../vendor/phaser.js']
      });

      gameData = React.addons.update(gameData, {
        baseURL: {$set: originalBaseURL}
      });

      $.ajax({
        method: 'POST',
        url: '/examples/' + name,
        data: {
          'html': html,
          'gameData': JSON.stringify(gameData)
        },
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {
          alert(new Error(textStatus + " " +  jqXHR.status));
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != "OK") {
            console.log(data);
            alert("Expected status OK but got something different!");
            return;
          }
          cb(name);
        }
      });
    },
    exportToFilesystem: function(gameData, cb) {
      var name = gameData.name;

      name = window.prompt("Enter name of example to export.", name);
      if (!name) return;
      this._exportToFilesystem(name, gameData, function(name) {
        alert("Successfully wrote " + name + "!");
        cb(name);
      });
    }
  };
});
