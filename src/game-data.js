define(function(require) {
  var React = require('react');

  var GameData = {};

  GameData.validateSymbol = function(symbol) {
    return symbol && symbol.length >= 1 &&
           /^[A-Za-z][A-Za-z0-9_]*$/.test(symbol);
  };

  GameData.resolveURL = function(gameData, url) {
    if (/^(https?:)?\/\//.test(url)) return url;
    return gameData.baseURL + url;
  };

  GameData.spriteIndex = function(gameData, id) {
    var index = -1;
    gameData.sprites.some(function(sprite, i) {
      if (sprite.id === id) {
        index = i;
        return true;
      }
    });
    return index;
  };

  GameData.withoutUnusedSpritesheets = function(gameData) {
    var spriteMap = {};

    gameData.sprites.forEach(function(sprite) {
      spriteMap[sprite.key] = true;
    });

    var newSpritesheets = gameData.spritesheets.filter(function(spritesheet) {
      return spritesheet.key in spriteMap;
    });

    var newAnimations = {};

    newSpritesheets.forEach(function(spritesheet) {
      newAnimations[spritesheet.key] = gameData.animations[spritesheet.key];
    });

    return React.addons.update(gameData, {
      spritesheets: {$set: newSpritesheets},
      animations: {$set: newAnimations}
    });
  };

  GameData.withoutUnusedSounds = function(gameData, soundsUsed) {
    var newSounds = [];
    var soundMap = {};

    soundsUsed.forEach(function(key) { soundMap[key] = true; });

    return React.addons.update(gameData, {
      sounds: {
        $set: gameData.sounds.filter(function(sound) {
          return sound.key in soundMap;
        })
      }
    });
  };

  GameData.withoutSprite = function(gameData, sprite) {
    var index = GameData.spriteIndex(gameData, sprite.id);
    if (index == -1) return gameData;
    return React.addons.update(gameData, {
      sprites: {
        $splice: [[index, 1]]
      }
    });
  };

  return GameData;
});
