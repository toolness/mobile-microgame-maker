define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Export = require('./export');
  var PhaserState = require('./phaser-state');
  var GameData = require('./game-data');
  var Blockly = require('./phaser-blocks');

  return {
    importFromFilesystem: function(name, cb) {
      name = window.prompt("Enter name of example to import.", name);
      if (!name) return;
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
    exportToFilesystem: function(gameData, cb) {
      var name = gameData.name;
      var originalBaseURL = gameData.baseURL;

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
          alert("Successfully wrote " + name + "!");
          cb(name);
        }
      });
    }
  };
});
