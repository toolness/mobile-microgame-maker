var Player = React.createClass({
  makePhaserState: function() {
    return {
      preload: function() {
        console.log('preload');
        this.game.load.spritesheet('fly', 'img/fly-flying.png', 80, 92);
      },
      create: function() {
        var fly = this.game.add.sprite(0, 0, 'fly');
        fly.inputEnabled = true;
        fly.input.enableDrag(false);
        fly.animations.add('flying', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10, true);
        fly.animations.play('flying');
        this.game.stage.backgroundColor = 0xf0f0f0;
        this.game.paused = true;
      }
    }
  },
  getInitialState: function() {
    return {
      isPaused: true
    };
  },
  componentWillMount: function() {
    window.player = this;
  },
  handlePlayPause: function() {
    this.refs.stage.game.paused = !this.state.isPaused;
    this.setState({isPaused: !this.state.isPaused});
  },
  handleStop: function() {
    if (!this.state.isPaused)
      this.handlePlayPause();
    this.refs.stage.setPhaserState(this.makePhaserState());
  },
  render: function() {
    return (
      <div>
        <Stage ref="stage" width={320} height={240} phaserState={this.makePhaserState()}/>
        <div className="btn-group">
          <button type="button" className="btn btn-default" onClick={this.handlePlayPause}>
            <span className={'glyphicon '+ (this.state.isPaused ? 'glyphicon-play'
                                                                : 'glyphicon-pause')}></span>
          </button>
          <button type="button" className="btn btn-default" onClick={this.handleStop}>
            <span className="glyphicon glyphicon-stop"></span>
          </button>
        </div>
      </div>
    );
  }
});
