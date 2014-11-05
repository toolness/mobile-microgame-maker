var Player = React.createClass({
  makePhaserState: function() {
    return {
      gameData: this.props.gameData,
      preload: function() {
        this.gameData.spritesheets.forEach(function(info) {
          this.game.load.spritesheet(info.key, info.url, info.frameWidth,
                                     info.frameHeight);
        }, this);
      },
      create: function() {
        this.gameData.sprites.forEach(function(info) {
          var sprite = this.game.add.sprite(info.x, info.y, info.key);
          this.gameData.animations[info.key].forEach(function(animInfo) {
            sprite.animations.add(animInfo.name, animInfo.frames,
                                  animInfo.frameRate, animInfo.loop);
          });
          sprite.animations.play(info.animation);
        }, this);
        this.game.stage.backgroundColor = this.gameData.backgroundColor;
        this.game.paused = true;
      }
    }
  },
  getInitialState: function() {
    return {
      isPaused: true
    };
  },
  componentDidUpdate: function(prevProps) {
    if (prevProps.gameData !== this.props.gameData)
      this.handleReload();
  },
  handlePlayPause: function() {
    this.refs.stage.game.paused = !this.state.isPaused;
    this.setState({isPaused: !this.state.isPaused});
  },
  handleReload: function() {
    if (!this.state.isPaused)
      this.handlePlayPause();
    this.refs.stage.setPhaserState(this.makePhaserState());
  },
  render: function() {
    return (
      <div>
        <Stage ref="stage" width={this.props.gameData.width} height={this.props.gameData.height} phaserState={this.makePhaserState()}/>
        <div className="btn-group">
          <button type="button" className="btn btn-default" onClick={this.handlePlayPause}>
            <span className={'glyphicon '+ (this.state.isPaused ? 'glyphicon-play'
                                                                : 'glyphicon-pause')}></span>
          </button>
          <button type="button" className="btn btn-default" onClick={this.handleReload}>
            <span className="glyphicon glyphicon-refresh"></span>
          </button>
        </div>
      </div>
    );
  }
});
