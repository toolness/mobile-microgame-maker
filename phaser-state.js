var PhaserState = {};

PhaserState.Generators = {};

PhaserState.Generators.stringifyArgs = function() {
  return [].slice.call(arguments).map(function(arg) {
    return JSON.stringify(arg);
  }).join(', ');
};

PhaserState.Generators.preload = function(gameData) {
  return [].concat(
    gameData.spritesheets.map(function(info) {
      return 'game.load.spritesheet(' + this.stringifyArgs(
               info.key, info.url, info.frameWidth, info.frameHeight
             ) + ');';
    }, this),
    gameData.sounds.map(function(info) {
      return 'game.load.audio(' + this.stringifyArgs(
               info.key, info.url
              ) + ');';
    }, this)
  ).join('\n');
};

PhaserState.Generators.createSounds = function(gameData) {
  return ['var sounds = state.sounds = {};'].concat(
    gameData.sounds.map(function(info) {
      return 'sounds.' + info.key + ' = game.add.audio(' +
        this.stringifyArgs(info.key) + ');';
    }, this)
  ).join('\n');
};

PhaserState.Generators.createSprites = function(gameData) {
  return _.flatten(['var sprites = state.sprites = {};'].concat(
    gameData.sprites.map(function(info) {
      var spriteName = 'sprites.' + info.name;
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
    }, this)
  )).join('\n');
};

PhaserState.preload = function(game, gameData) {
  eval(this.Generators.preload(gameData));
};

PhaserState.createSounds = function(game, gameData) {
  var state = {};
  eval(this.Generators.createSounds(gameData));
  return state.sounds;
};

PhaserState.createSprites = function(game, gameData) {
  var state = {};
  eval(this.Generators.createSprites(gameData));
  return state.sprites;
};

PhaserState.createEventEmitter = function(target) {
  var eventHandlers = {};

  target.trigger = function(eventName) {
    var handlers = eventHandlers[eventName] || [];
    handlers.forEach(function(cb) { cb(); });
  };

  target.on = function(eventName, cb) {
    if (!(eventName in eventHandlers))
      eventHandlers[eventName] = [];
    eventHandlers[eventName].push(cb);
  };

  return target;
};

PhaserState.DEFAULT_PLAY_TIME = 5000;
PhaserState.DEFAULT_ENDING_TIME = 2000;
PhaserState.PHASER_VERSION = "2.1.3";

PhaserState.createState = function(options) {
  var gameData = options.gameData;
  var autoplay = options.autoplay;
  var start = options.start;
  var state = PhaserState.createEventEmitter({
    preload: function() {
      if (!state.Phaser) {
        // Our client didn't set this for us, so we'll assume that
        // Phaser is in the global namespace.
        state.Phaser = Phaser;
      }
      if (state.Phaser.VERSION != PhaserState.PHASER_VERSION)
        throw new Error("Expected Phaser " + PhaserState.PHASER_VERSION +
                        " but got " + state.Phaser.VERSION);
      PhaserState.preload(this.game, gameData);
    },
    create: function() {
      this.sprites = PhaserState.createSprites(this.game, gameData);
      this.sounds = PhaserState.createSounds(this.game, gameData);
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

  state.microgame = new PhaserState.Microgame({
    state: state,
    playTime: options.playTime || PhaserState.DEFAULT_PLAY_TIME,
    endingTime: options.endingTime || PhaserState.DEFAULT_ENDING_TIME
  });
  if (options.onGameEnded)
    state.on('end', options.onGameEnded.bind(null, state));

  return state;
};

PhaserState.Microgame = function(options) {
  this.state = options.state;
  this.endingTime = options.endingTime;
  this.playTime = this.timeLeft = options.playTime;
  this.phase = 'PLAYING';
  this.outcome = undefined;
};

PhaserState.Microgame.prototype = {
  TIME_BAR_HEIGHT: 8,
  create: function() {
    var Phaser = this.state.Phaser;
    this.timeBar = new Phaser.Rectangle(0, 0, this.state.game.width,
                                        this.TIME_BAR_HEIGHT);
  },
  render: function() {
    var game = this.state.game;
    if (this.phase == 'PLAYING') {
      game.debug.geom(this.timeBar, '#000000');
    } else {
      game.debug.text("Player has " + this.outcome + " the game.",
                      0, this.TIME_BAR_HEIGHT + 4,
                      this.outcome == 'WON' ? "lightgreen" : "red");
    }
  },
  update: function() {
    this.timeLeft -= this.state.game.time.elapsed;
    if (this.timeLeft < 0) this.timeLeft = 0;
    if (this.timeLeft == 0) {
      if (this.phase == 'PLAYING') {
        this.state.trigger('outoftime');
        if (this.outcome === undefined)
          this.outcome = 'LOST';
        this.setupEndingPhase();
      } else if (this.phase == 'ENDING') {
        this.phase = 'ENDED';
        this.state.trigger('end');
      }
    }
    this.timeBar.right = (this.timeLeft / this.playTime) *
                         this.state.game.width;
  },
  setupEndingPhase: function() {
    this.timeLeft = this.endingTime;
    this.phase = 'ENDING';
    this.state.game.input.disabled = true;
  },
  win: function() {
    if (this.phase != 'PLAYING') return;
    this.setupEndingPhase();
    this.outcome = 'WON';
  },
  lose: function() {
    if (this.phase != 'PLAYING') return;
    this.setupEndingPhase();
    this.outcome = 'LOST';
  },
  isEnded: function() {
    return this.phase == 'ENDED';
  }
};
