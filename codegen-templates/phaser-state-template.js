// This microgame was created with the Mobile Minigame Maker. Learn more
// at https://toolness.github.io/mobile-microgame-maker/.
//
// This code uses Phaser--a fun, free and fast 2D game framework for
// making HTML5 games for desktop and mobile web browsers. Learn more
// at http://phaser.io/.

<%= preload %>

<%= createSprites %>

<%= createSounds %>

// This function is generated from the microgame's Blockly source.

<%= start %>

<%= extra %>

var state = PhaserMicrogame.SimpleEventEmitter({
  preload: function() {
    <% if (phaserIsUndefined) { %>Phaser = this.Phaser;<% } else { %>this.Phaser = Phaser;<% } %>
    if (this.Phaser.VERSION != "<%= expectedPhaserVersion %>")
      throw new Error("Expected Phaser <%= expectedPhaserVersion %> but got " +
                      this.Phaser.VERSION);
    preload(this.game);
    this.trigger('preload');
  },
  create: function() {
    createSprites(this);
    createSounds(this);
    this.game.transparent = false;
    this.game.stage.backgroundColor = 0x<%= gameData.backgroundColor.toString(16) %>;

    this.microgame.mainText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY,
      '',
      {
        font: "30px 'Fredoka One'",
        fill: "#000000",
        stroke: "#ffffff",
        strokeThickness: 4,
        align: "center"
      }
    );
    this.microgame.mainText.anchor.setTo(0.5, 0.5);
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
  difficulty: '<%= difficulty %>',
  playTime: <%= playTime %>,
  endingTime: <%= endingTime %>
});

var time = state.microgame.time;
