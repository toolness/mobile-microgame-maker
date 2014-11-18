define(function(require) {
  var Tabletop = require('tabletop');

  return function spreadsheetToSpritesheet(key, cb) {
    Tabletop.init({
      key: key,
      callback: function(data) {
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
      },
      simpleSheet: true
    });
  }
});
