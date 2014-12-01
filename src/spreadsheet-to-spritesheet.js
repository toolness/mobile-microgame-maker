if (typeof(define) == 'undefined')
  define = function(fn) {
    module.exports = fn(require);
  };

define(function(require) {
  var Tabletop = require('tabletop');

  var DEFAULT_KEY = '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs';

  return function spreadsheetToSpritesheet(key, cb) {
    if (typeof(key) == 'function') {
      cb = key;
      key = null;
    }

    Tabletop.init({
      key: key || DEFAULT_KEY,
      callback: function(models) {
        var data = models.spritesheets.all();
        var spritesheets = [];
        var animations = {};
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
        cb({
          spritesheets: spritesheets,
          animations: animations
        });
      }
    });
  }
});
