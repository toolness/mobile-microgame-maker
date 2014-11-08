var PhaserState = {};

PhaserState.preload = function(game, gameData) {
  gameData.spritesheets.forEach(function(info) {
    game.load.spritesheet(info.key, info.url, info.frameWidth,
                          info.frameHeight);
  });
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
