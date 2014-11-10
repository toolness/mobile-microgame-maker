var PhaserState = {};

PhaserState.preload = function(game, gameData) {
  gameData.spritesheets.forEach(function(info) {
    game.load.spritesheet(info.key, info.url, info.frameWidth,
                          info.frameHeight);
  });
  gameData.sounds.forEach(function(info) {
    game.load.audio(info.key, info.url);
  });
};

PhaserState.createSounds = function(game, gameData) {
  var sounds = {};
  gameData.sounds.forEach(function(info) {
    sounds[info.key] = game.add.audio(info.key);
  });
  return sounds;
};

PhaserState.createSprites = function(game, gameData) {
  var sprites = {};
  gameData.sprites.forEach(function(info) {
    var sprite = game.add.sprite(info.x, info.y, info.key);
    gameData.animations[info.key].forEach(function(animInfo) {
      sprite.animations.add(animInfo.name, animInfo.frames,
                            animInfo.frameRate, animInfo.loop);
    });
    sprite.animations.play(info.animation);
    sprites[info.name] = sprite;
  });

  return sprites;
};
