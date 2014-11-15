var Player = React.createClass({
  getInitialState: function() {
    return {
      isPaused: true,
      phaserState: this.makePhaserState()
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.gameData !== this.props.gameData)
      this.resetGame(nextProps);
  },
  resetGame: function(props, autoplay) {
    this.setState(React.addons.update(this.state, {
      isPaused: {$set: true},
      phaserState: {$set: this.makePhaserState(props, autoplay)}
    }));
  },
  makePhaserState: function(props, autoplay) {
    props = props || this.props;
    return props.makePhaserState({
      onGameEnded: this.handleGameEnded,
      autoplay: !!autoplay
    });
  },
  handleGameEnded: function(phaserState) {
    phaserState.game.paused = true;
    this.setState(React.addons.update(this.state, {
      isPaused: {$set: true}
    }));
  },
  handlePlayPause: function() {
    if (this.state.phaserState.isEnded() &&
        this.state.isPaused) {
      this.setState(React.addons.update(this.state, {
        isPaused: {$set: false}
      }));
      return this.resetGame(this.props, true);
    }
    this.state.phaserState.game.paused = !this.state.isPaused;
    this.setState(React.addons.update(this.state, {
      isPaused: {$set: !this.state.isPaused}
    }));
  },
  handleReload: function() {
    this.resetGame(this.props);
  },
  render: function() {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={{
          display: 'inline-block',
          width: this.props.gameData.width
        }}>
          <div style={{pointerEvents: this.state.isPaused ? 'none' : 'auto'}}>
            <Stage width={this.props.gameData.width} height={this.props.gameData.height} phaserState={this.state.phaserState}/>
          </div>
          <div className="btn-group btn-group-justified">
            <div className="btn-group">
              <button type="button" className="btn btn-default" onClick={this.handlePlayPause}>
                <span className={'glyphicon '+ (this.state.isPaused ? 'glyphicon-play'
                                                                    : 'glyphicon-pause')}></span>
              </button>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-default" onClick={this.handleReload}>
                <span className="glyphicon glyphicon-refresh"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
