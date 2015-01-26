define(function(require) {
  var _ = require('underscore');
  var guid = require('guid');
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

  GameData.spriteWithName = function(gameData, name) {
    return _.findWhere(gameData.sprites, {name: name});
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

  GameData.makeSprite = function(gameData, spritesheet, animation) {
    return {
      id: guid(),
      name: GameData.findUnusedSpriteName(gameData,
                                          spritesheet.key),
      x: _.random(gameData.width - spritesheet.frameWidth),
      y: _.random(gameData.height - spritesheet.frameHeight),
      key: spritesheet.key,
      animation: animation
    };
  };

  GameData.findUnusedSpriteName = function(gameData, baseName) {
    var names = _.pluck(gameData.sprites, 'name');
    for (var i = 1; i < 10000; i++) {
      var candidate = baseName + '_' + i;
      if (names.indexOf(candidate) == -1) return candidate;
    }
    throw new Error('maximum number of sprites reached');
  };

  GameData.minimize = function(gameData, soundsUsed) {
    gameData = GameData.withoutUnusedSounds(gameData, soundsUsed);
    return GameData.withoutUnusedSpritesheets(gameData);
  };

  GameData.maximize = function(gameData, assetLibrary) {
    var uniqueLibSounds = assetLibrary.sounds.filter(function(sound) {
      return !_.findWhere(gameData.sounds, {key: sound.key});
    });
    var newSounds = gameData.sounds.concat(uniqueLibSounds);
    var uniqueLibSheets = assetLibrary.spritesheets.filter(function(ss) {
      return !_.findWhere(gameData.spritesheets, {key: ss.key});
    });
    var newSheets = gameData.spritesheets.concat(uniqueLibSheets);
    var newAnims = _.extend({}, assetLibrary.animations);
    _.keys(gameData.animations).forEach(function(name) {
      newAnims[name] = gameData.animations[name];
    });

    return React.addons.update(gameData, {
      sounds: {$set: newSounds},
      spritesheets: {$set: newSheets},
      animations: {$set: newAnims}
    });
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
