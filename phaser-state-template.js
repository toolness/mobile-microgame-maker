<%= preload %>

<%= createSprites %>

<%= createSounds %>

<%= start %>

<%= extra %>

var state = SimpleEventEmitter({
  preload: function() {
    this.Phaser = this.Phaser || Phaser;
    if (this.Phaser.VERSION != "<%= expectedPhaserVersion %>")
      throw new Error("Expected Phaser <%= expectedPhaserVersion %> but got " +
                      this.Phaser.VERSION);
    preload(this.game);
  },
  create: function() {
    createSprites(this);
    createSounds(this);
    this.game.stage.backgroundColor = 0x<%= gameData.backgroundColor.toString(16) %>;
    this.microgame.create();
    start(this);
    this.trigger('create');
  },
  update: function() {
    this.microgame.update();
    this.trigger('update');
  },
  render: function() {
    this.microgame.render();
  }
});

state.microgame = new PhaserMicrogame({
  state: state,
  playTime: <%= playTime %>,
  endingTime: <%= endingTime %>
});
