$(function() {
  var phaserState = {
    preload: function() {
      window.game = this.game;
      this.game.load.spritesheet('fly', 'img/fly-flying.png', 80, 92);
    },
    create: function() {
      var fly = this.game.add.sprite(0, 0, 'fly');
      fly.inputEnabled = true;
      fly.input.enableDrag(false);
      this.game.stage.backgroundColor = 0xf0f0f0;
    }
  };

  var main = React.render(
    <div className="container">
      <h1>Mobile Microgame Maker</h1>
      <Stage width={320} height={240} phaserState={phaserState}/>
    </div>,
    $('#main')[0]
  );

  console.log(main);
});
