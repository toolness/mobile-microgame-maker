var PhaserState = {};

PhaserState.Generators = {};

PhaserState.Generators.stringifyArgs = function() {
  return [].slice.call(arguments).map(function(arg) {
    return JSON.stringify(arg);
  }).join(', ');
};

PhaserState.Generators.preload = function(gameData) {
  var resolveURL = GameData.resolveURL.bind(GameData, gameData);

  return ['function preload(game) {'].concat(
    gameData.spritesheets.map(function(info) {
      return '  game.load.spritesheet(' + this.stringifyArgs(
               info.key, resolveURL(info.url),
               info.frameWidth, info.frameHeight
             ) + ');';
    }, this),
    gameData.sounds.map(function(info) {
      return '  game.load.audio(' + this.stringifyArgs(
               info.key, resolveURL(info.url)
              ) + ');';
    }, this),
    ['}']
  ).join('\n');
};

PhaserState.Generators.createSounds = function(gameData) {
  return ['function createSounds(state) {'].concat(
    ['  var sounds = state.sounds = {};'],
    ['  var game = state.game;'],
    gameData.sounds.map(function(info) {
      return '  sounds.' + info.key + ' = game.add.audio(' +
        this.stringifyArgs(info.key) + ');';
    }, this),
    ['}']
  ).join('\n');
};

PhaserState.Generators.createSprites = function(gameData) {
  return _.flatten(['function createSprites(state) {'].concat(
    ['  var sprites = state.sprites = {};'],
    ['  var game = state.game;'],
    gameData.sprites.map(function(info) {
      var spriteName = '  sprites.' + info.name;
      var animations = gameData.animations[info.key];

      return [
        spriteName + ' = game.add.sprite(' +
        this.stringifyArgs(info.x, info.y, info.key) + ');'
      ].concat(animations.map(function(animInfo) {
        return spriteName + '.animations.add(' + this.stringifyArgs(
          animInfo.name, animInfo.frames,
          animInfo.frameRate, animInfo.loop
        ) + ');';
      }, this)).concat([
        spriteName + '.animations.play(' +
        this.stringifyArgs(info.animation) + ');'
      ]);
    }, this),
    ['}']
  )).join('\n');
};

PhaserState.Generators.createState = function(options) {
  var gameData = options.gameData;

  return _.template(this._stateTemplate, {
    preload: this.preload(gameData),
    createSprites: this.createSprites(gameData),
    createSounds: this.createSounds(gameData),
    expectedPhaserVersion: this.PHASER_VERSION,
    gameData: gameData,
    playTime: options.playTime || this.DEFAULT_PLAY_TIME,
    endingTime: options.endingTime || this.DEFAULT_ENDING_TIME,
    extra: options.extra || '',
    start: options.start
  });
};

PhaserState.Generators.makeFunc = function(name, gameData) {
  return eval('(' + this[name](gameData) + ')');
};

PhaserState.Generators.DEFAULT_PLAY_TIME = 5000;
PhaserState.Generators.DEFAULT_ENDING_TIME = 2000;
PhaserState.Generators.PHASER_VERSION = "2.1.3";

PhaserState.Generators.makeStateObject = function(options) {
  var stateJs = this.createState({
    gameData: options.gameData,
    start: options.start,
    playTime: options.playTime,
    endingTime: options.endingTime
  });
  stateJs = '//# sourceURL=generated-phaser-state-code.js\n' + stateJs;

  console.log("stateJs is", stateJs);
  eval(stateJs);

  _.extend(state, {
    setPaused: function(isPaused) {
      this.game.paused = isPaused;
    },
    isEnded: function() {
      return this.microgame.isEnded();
    }
  });

  state.on('create', function() {
    if (!options.autoplay)
      state.game.paused = true;
  });

  if (options.onGameEnded)
    state.on('end', options.onGameEnded.bind(null, state));

  return state;
};

AssetLoader.add(
  $.get('phaser-state-template.js', function(js) {
    PhaserState.Generators._stateTemplate = js;
  }, "text")
);
