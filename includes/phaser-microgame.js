// This encapsulates a "microgame", i.e. a very short game that takes
// a few seconds to play, has a win/lose outcome, and is given a few
// seconds to show an ending animation.

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
      Tinygame.loaded();
    } else {
      this.timeBar = new Phaser.Rectangle(0, 0, game.width,
                                          this.TIME_BAR_HEIGHT);
    }
    this.mainText = game.add.text(
      game.world.centerX,
      game.world.centerY,
      '',
      {
        font: "30px Courier",
        fill: "#000000",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center"
      }
    );
    this.mainText.anchor.setTo(0.5, 0.5);
  },
  render: function() {
    var game = this.state.game;

    if (this.usingTinygame) {
      document.body.style.backgroundColor =
        '#' + game.stage.backgroundColor.toString(16);
    } else {
      if (this.phase == 'PLAYING') {
        game.debug.geom(this.timeBar, '#000000');
      } else {
        game.debug.text("Player has " + this.outcome + " the game.",
                        0, this.TIME_BAR_HEIGHT + 4,
                        this.outcome == 'WON' ? "lightgreen" : "red");
      }
    }
  },
  update: function() {
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
