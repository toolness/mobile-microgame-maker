define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Export = require('./export');
  var PhaserState = require('./phaser-state');
  var GameData = require('./game-data');
  var Blockly = require('./phaser-blocks');
  var defaultGameData = require('./default-game-data');

  return {
    importFromFilesystem: function(name, cb) {
      name = window.prompt("Enter name of example to import.", name);
      if (!name) return;

      $.ajax({
        url: '/examples/' + name,
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {
          alert(new Error(textStatus + " " +  jqXHR.status));
        },
        success: function(gameData, textStatus, jqXHR) {
          alert("Successfully imported " + name + "!");
          cb(GameData.maximize(gameData, defaultGameData));
        }
      });
    },
    exportToFilesystem: function(gameData, cb) {
      var name = gameData.name;

      name = window.prompt("Enter name of example to export.", name);
      if (!name) return;

      gameData = React.addons.update(gameData, {
        name: {$set: name},
        baseURL: {$set: '../assets/'}
      });

      var blocklyInfo = Blockly.Phaser.generateJs(gameData);

      gameData = GameData.minimize(gameData, blocklyInfo.soundsUsed);

      var stateJs = PhaserState.Generators.createState({
        gameData: gameData,
        blocklyInfo: blocklyInfo,
        standalone: false
      });
      var html = Export.toHtml(gameData, {
        stateJs: stateJs,
        encourageRemix: false,
        baseAssetURL: gameData.baseURL,
        scripts: [
          '../vendor/phaser.js',
          '../vendor/tinygame.js',
          '../includes/phaser-microgame.js',
          '../includes/simple-event-emitter.js',
        ]
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
          alert("Successfully wrote " + name + "!");
          cb(name);
        }
      });
    }
  };
});
