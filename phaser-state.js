var PhaserState = {};

PhaserState.Generators = {};

PhaserState.Generators.stringifyArgs = function() {
  return [].slice.call(arguments).map(function(arg) {
    return JSON.stringify(arg);
  }).join(', ');
};

PhaserState.Generators.preload = function(gameData) {
  return ['function preload(game) {'].concat(
    gameData.spritesheets.map(function(info) {
      return '  game.load.spritesheet(' + this.stringifyArgs(
               info.key, info.url, info.frameWidth, info.frameHeight
             ) + ');';
    }, this),
    gameData.sounds.map(function(info) {
      return '  game.load.audio(' + this.stringifyArgs(
               info.key, info.url
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

PhaserState.Generators.makeFunc = function(name, gameData) {
  return eval('(' + this[name](gameData) + ')');
};

PhaserState.DEFAULT_PLAY_TIME = 5000;
PhaserState.DEFAULT_ENDING_TIME = 2000;
PhaserState.PHASER_VERSION = "2.1.3";

PhaserState.createState = function(options) {
  var gameData = options.gameData;
  var autoplay = options.autoplay;
  var start = options.start;
  var state = SimpleEventEmitter({
    preload: function() {
      if (!state.Phaser) {
        // Our client didn't set this for us, so we'll assume that
        // Phaser is in the global namespace.
        state.Phaser = Phaser;
      }
      if (state.Phaser.VERSION != PhaserState.PHASER_VERSION)
        throw new Error("Expected Phaser " + PhaserState.PHASER_VERSION +
                        " but got " + state.Phaser.VERSION);
      PhaserState.Generators.makeFunc('preload', gameData)(this.game);
    },
    create: function() {
      PhaserState.Generators.makeFunc('createSprites', gameData)(this);
      PhaserState.Generators.makeFunc('createSounds', gameData)(this);
      this.game.stage.backgroundColor = gameData.backgroundColor;
      this.microgame.create();
      if (!autoplay)
        this.game.paused = true;

      start(this);
    },
    update: function() {
      this.microgame.update();
      this.trigger('update');
    },
    render: function() {
      this.microgame.render();
    },
    setPaused: function(isPaused) {
      this.game.paused = isPaused;
    },
    isEnded: function() {
      return this.microgame.isEnded();
    }
  });

  state.microgame = new PhaserMicrogame({
    state: state,
    playTime: options.playTime || PhaserState.DEFAULT_PLAY_TIME,
    endingTime: options.endingTime || PhaserState.DEFAULT_ENDING_TIME
  });
  if (options.onGameEnded)
    state.on('end', options.onGameEnded.bind(null, state));

  return state;
};
