// PhaserMicrogame v0.1.3
// 
// This micro-library can be used to make a "microgame", i.e. a very
// short game that takes a few seconds to play, has a win/lose
// outcome, and is given a few seconds to show an ending animation.
//
// Its dependencies are:
//
//   * Phaser - http://phaser.io/
//   * Tinygame - https://github.com/toolness/fancy-friday

// ## PhaserMicrogame constructor
//
// This encapsulates a microgame.

var PhaserMicrogame = function(options) {
  var playTime = options.playTime;
  var endingTime = options.endingTime;

  this.state = options.state;
  this.phase = 'PLAYING';
  this.outcome = undefined;
  this.usingTinygame = (typeof(Tinygame) != 'undefined');

  if (this.usingTinygame) {
    Tinygame.loading();
    Tinygame.onplay = function() {
      this.state.game.paused = false;
    }.bind(this);
    playTime = Tinygame.playTime * 1000;
    endingTime = Tinygame.endingTime * 1000;
    this._tinygameLoadedCountdown = 2;
  }

  this.endingTime = endingTime;
  this.playTime = this.timeLeft = playTime;
};

PhaserMicrogame.prototype = {
  TIME_BAR_HEIGHT: 8,
  create: function() {
    var Phaser = this.state.Phaser;
    var game = this.state.game;
    if (this.usingTinygame) {
      this.state.game.paused = true;
    } else {
      this.timeBar = new Phaser.Rectangle(0, 0, game.width,
                                          this.TIME_BAR_HEIGHT);
    }

    if (!this.mainText) {
      // TODO: Deprecate this; we want PhaserMicrogame to
      // encapsulate the bare minimum required for a microgame so that
      // anyone can use it to develop their own microgame with Phaser,
      // but mainText is quite specific to MMM.
      console.log("Creating mainText, but this feature will be dropped " +
                  "in phaser-microgame v0.2.");
      this.mainText = game.add.text(
        game.world.centerX,
        game.world.centerY,
        '',
        {
          font: "30px 'Fredoka One'",
          fill: "#000000",
          stroke: "#ffffff",
          strokeThickness: 4,
          align: "center"
        }
      );
      this.mainText.anchor.setTo(0.5, 0.5);
    }
  },
  render: function() {
    var game = this.state.game;

    if (this.usingTinygame) {
      document.body.style.backgroundColor = Phaser.Color.getWebRGB(
        game.stage.backgroundColor
      );

      if (this._tinygameLoadedCountdown) {
        // We want to give the game a few frames to properly
        // render itself so it isn't accidentally shown in a
        // half-formed state.
        this._tinygameLoadedCountdown--;
        if (this._tinygameLoadedCountdown == 0)
          Tinygame.loaded();
      }
    } else {
      if (this.phase == 'PLAYING') {
        game.debug.geom(this.timeBar, '#000000');
      }
    }
  },
  update: function() {
    if (!this.state.game.paused)
      this.timeLeft -= this.state.game.time.elapsed;
    if (this.timeLeft < 0) this.timeLeft = 0;
    if (this.timeLeft === 0) {
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

    if (!this.usingTinygame) {
      this.timeBar.right = (this.timeLeft / this.playTime) *
                           this.state.game.width;
    }
  },
  setupEndingPhase: function() {
    if (this.usingTinygame)
      Tinygame.end(this.outcome == 'WON' ? 1 : 0);
    this.timeLeft = this.endingTime;
    this.phase = 'ENDING';
    this.state.game.input.disabled = true;
    this.state.trigger(this.outcome == 'WON' ? 'win' : 'lose');
    this.state.trigger('ending');
  },
  win: function() {
    if (this.phase != 'PLAYING') return;
    this.outcome = 'WON';
    this.setupEndingPhase();
  },
  lose: function() {
    if (this.phase != 'PLAYING') return;
    this.outcome = 'LOST';
    this.setupEndingPhase();
  },
  isEnded: function() {
    return this.phase == 'ENDED';
  }
};

// ## PhaserMicrogame.SimpleEventEmitter constructor
//
// This is a simple nodeJS EventEmitter-style constructor that just
// attaches .on() and .trigger() to the given target object.

PhaserMicrogame.SimpleEventEmitter = function SimpleEventEmitter(target) {
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

// ## PhaserMicrogame.installStupidHacks()
//
// Install any annoying hacks we need to have Phaser run properly
// on the widest variety of platforms.

PhaserMicrogame.installStupidHacks = function() {

  // Safari caches cross-origin resources in a ridiculous way.
  // We'll work around this annoyance by monkeypatching 
  // Phaser to ensure that we never ask for cached data.

  function bypassSafariCORSLameness() {
    var LoaderProto = Phaser.Loader.prototype;
    var ua = navigator.userAgent;
    var isSafari = /safari/i.test(ua) && !/chrome/i.test(ua);
    if (!isSafari || LoaderProto.originalXhrLoad) return;

    console.log("Monkeypatching Phaser.Loader to bust cache because " +
                "https://github.com/photonstorm/phaser/issues/1355.");
    LoaderProto.originalXhrLoad = LoaderProto.xhrLoad;
    LoaderProto.xhrLoad = function(index, url, type, onload, onerror) {
      url = url + '?cacheBust=' + Date.now();
      return this.originalXhrLoad(index, url, type, onload, onerror);
    };
  }

  bypassSafariCORSLameness();
};
