define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Export = require('./export');
  var PhaserState = require('./phaser-state');
  var GameData = require('./game-data');
  var Blockly = require('./phaser-blocks');

  var EXAMPLES = require('examples/examples');

  return {
    regenerateExample: function(example, cb) {
      this._importFromFilesystem(example, function(err, gameData) {
        if (err) return cb(err);
        this._exportToFilesystem(example, gameData, cb);
      }.bind(this));
    },
    regenerateAllExamples: function() {
      var examplesLeft = EXAMPLES.slice();
      var importNextGame = function() {
        var example = examplesLeft.pop();

        console.log("regenerating examples/" + example);
        this.regenerateExample(example, function(err) {
          if (err) return alert("Error! " + err.message);
          if (examplesLeft.length == 0)
            alert("All examples regenerated!");
          else
            importNextGame();
        });
      }.bind(this);

      importNextGame();
    },
    _importFromFilesystem: function(name, cb) {
      var url = require.toUrl('examples/' + name + '.html');
      Export.fromUrl(url, function(err, gameData) {
        if (err) return cb(err);
        if (gameData == null)
          return cb(new Error("No game data found!"));
        cb(null, gameData);
      });
    },
    importFromFilesystem: function(name, cb) {
      name = window.prompt("Enter name of example to import.", name);
      if (!name) return;
      this._importFromFilesystem(name, function(err, gameData) {
        if (err) return alert("Error! " + err.message);
        cb(gameData);
      });
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
        standalone: true,
        gameData: gameData,
        blocklyInfo: blocklyInfo
      });
      var html = Export.toHtml(gameData, {
        stateJs: stateJs,
        encourageRemix: true,
        gameDataForRemix: name + '.json',
        baseAssetURL: gameData.baseURL,
        baseCreatorURL: '../',
        scripts: ['../vendor/phaser-' +
                  PhaserState.Generators.PHASER_VERSION + '.js']
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
          return cb(new Error(textStatus + " " +  jqXHR.status));
        },
        success: function(data, textStatus, jqXHR) {
          if (data.status != "OK")
            return cb(new Error("POST failed: " + JSON.stringify(data)));
          cb(null, name);
        }
      });
    },
    exportToFilesystem: function(gameData, cb) {
      var name = gameData.name;

      name = window.prompt("Enter name of example to export.", name);
      if (!name) return;
      this._exportToFilesystem(name, gameData, function(err, name) {
        if (err) return alert("Error! " + err.message);
        alert("Successfully wrote " + name + "!");
        cb(name);
      });
    }
  };
});
