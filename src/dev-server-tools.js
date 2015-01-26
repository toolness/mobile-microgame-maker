define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Export = require('./export');
  var GameData = require('./game-data');
  var Blockly = require('./phaser-blocks');

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
        success: function(data, textStatus, jqXHR) {
          alert("Successfully imported " + name + "!");
          cb(data);
        }
      });
    },
    exportToFilesystem: function(gameData, cb) {
      var name = gameData.name;

      name = window.prompt("Enter name of example to export.", name);
      if (!name) return;

      var html = Export.toHtml(gameData, {encourageRemix: false});
      var blocklyInfo = Blockly.Phaser.generateJs(gameData);

      gameData = React.addons.update(gameData, {
        name: {$set: name}
      });
      gameData = GameData.minimize(gameData, blocklyInfo.soundsUsed);

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
