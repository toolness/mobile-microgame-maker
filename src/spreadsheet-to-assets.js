if (typeof(define) == 'undefined')
  define = function(fn) {
    module.exports = fn(require);
  };

define(function(require) {
  var Tabletop = require('tabletop');

  var DEFAULT_KEY = '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs';

  function addSounds(gameData, data) {
    gameData.sounds = data.map(function(row) {
      return {
        key: row.key,
        url: row.url
      };
    });
  }

  function addSpritesheets(gameData, data) {
    var spritesheets = gameData.spritesheets = [];
    var animations = gameData.animations = {};
    var lastSpritesheetKey;
    data.forEach(function(row) {
      var key = row.spritesheetkey || lastSpritesheetKey;
      if (row.spritesheetkey) {
        spritesheets.push({
          key: key,
          url: row.url,
          frameWidth: parseInt(row.framewidth),
          frameHeight: parseInt(row.frameheight)
        });
        lastSpritesheetKey = key;
        animations[key] = [];
      }
      if (row.animationkey && key) {
        animations[key].push({
          name: row.animationkey,
          frames: row.animationframes.split(',').map(function(frame) {
            return parseInt(frame.trim());
          }),
          frameRate: parseInt(row.animationfps),
          loop: row.animationloop == "TRUE"
        });
      }
    });
  }

  return function spreadsheetToAssets(key, cb) {
    Tabletop.init({
      key: key || DEFAULT_KEY,
      callback: function(models) {
        var gameData = {};

        addSpritesheets(gameData, models.spritesheets.all());
        addSounds(gameData, models.sounds.all());
        cb(gameData);
      }
    });
  }
});
