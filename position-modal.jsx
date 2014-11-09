var PositionModal = React.createClass({
  makePhaserState: function(gameData) {
    return {
      preload: function() {
        PhaserState.preload(this.game, gameData);
      },
      create: function() {
        PhaserState.createSprites(this.game, gameData);
        this.game.stage.backgroundColor = gameData.backgroundColor;
        this.game.paused = true;
      }
    };
  },
  getInitialState: function() {
    var gameData = GameData.withoutSprite(this.props.initialGameData,
                                          this.props.initialSprite);
    return {
      gameData: gameData,
      sprite: this.props.initialSprite,
      movingSprite: this.props.initialSprite,
      phaserState: this.makePhaserState(gameData)
    };
  },
  componentDidMount: function() {
    var movable = this.refs.movable.getDOMNode();
    var hammer = this.hammer = new Hammer(movable);
    hammer.on('panmove', function(e) {
      this.setState(React.addons.update(this.state, {
        movingSprite: {
          x: {$set: this.state.sprite.x + e.deltaX},
          y: {$set: this.state.sprite.y + e.deltaY}
        }
      }));
    }.bind(this));
    hammer.on('panend', function(e) {
      this.setState(React.addons.update(this.state, {
        sprite: {$set: this.state.movingSprite}
      }));
    }.bind(this));
  },
  componentWillUnmount: function() {
    this.hammer.destroy();
    this.hammer = null;
  },
  handleSave: function() {
    this.props.onSave(this.state.sprite);
  },
  render: function() {
    var gameData = this.state.gameData;
    var sprite = this.state.sprite;
    var movingSprite = this.state.movingSprite;
    var movableTransform = 'translate(' + movingSprite.x + 'px, ' +
                                          movingSprite.y + 'px)';
    var movableStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: 'rgba(0, 255, 0, 0.25)',
      transform: movableTransform,
      webkitTransform: movableTransform,
      mozTransform: movableTransform
    };

    return (
      <Modal title={"Set position for " + sprite.name} onCancel={this.props.onCancel} onSave={this.handleSave} onFinished={this.props.onFinished}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            display: 'inline-block',
            position: 'relative',
            width: gameData.width,
            marginLeft: -20,
            marginRight: -20
          }}>
            <div style={{opacity: 0.5, pointerEvents: 'none'}}>
              <Stage ref="stage" width={gameData.width} height={gameData.height} phaserState={this.state.phaserState}/>
            </div>
            <div ref="movable" style={movableStyle}>
              <CssSprite gameData={gameData} sprite={sprite}/>
            </div>
          </div>
          <p>Just drag the object around.</p>
        </div>
      </Modal>
    );
  }
});
