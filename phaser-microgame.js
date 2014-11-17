var PhaserMicrogame = function(options) {
  this.state = options.state;
  this.endingTime = options.endingTime;
  this.playTime = this.timeLeft = options.playTime;
  this.phase = 'PLAYING';
  this.outcome = undefined;
};

PhaserMicrogame.prototype = {
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
