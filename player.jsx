var Player = React.createClass({
  getInitialState: function() {
    return {
      isPaused: true,
      phaserState: this.props.makePhaserState()
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.gameData !== this.props.gameData)
      this.resetGame(nextProps);
  },
  resetGame: function(props) {
    this.setState(React.addons.update(this.state, {
      isPaused: {$set: true},
      phaserState: {$set: props.makePhaserState()}
    }));    
  },
  handlePlayPause: function() {
    this.refs.stage.game.paused = !this.state.isPaused;
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
          <Stage ref="stage" width={this.props.gameData.width} height={this.props.gameData.height} phaserState={this.state.phaserState}/>
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
      </div>
    );
  }
});
