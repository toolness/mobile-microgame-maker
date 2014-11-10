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
      isShown: false,
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
      this.updateFields();
    }.bind(this));
    hammer.on('panend', function(e) {
      this.setState(React.addons.update(this.state, {
        sprite: {$set: this.state.movingSprite}
      }));
      this.updateFields();
    }.bind(this));
  },
  handleShown: function() {
    this.setState(React.addons.update(this.state, {
      isShown: {$set: true}
    }));
  },
  componentWillUnmount: function() {
    this.hammer.destroy();
    this.hammer = null;
  },
  updateFields: function() {
    this.refs.x.getDOMNode().value = this.state.movingSprite.x;
    this.refs.y.getDOMNode().value = this.state.movingSprite.y;
  },
  handleSave: function() {
    this.props.onSave(this.state.sprite);
  },
  handleBlurNumber: function(prop, e) {
    e.target.value = this.state.sprite[prop];
  },
  handleChangeNumber: function(prop, e) {
    var val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    var changes = {};
    changes[prop] = {$set: val};
    this.setState(React.addons.update(this.state, {
      movingSprite: changes,
      sprite: changes
    }));
  },
  render: function() {
    var gameData = this.state.gameData;
    var sprite = this.state.sprite;
    var movingSprite = this.state.movingSprite;

    // An apparent bug on iOS 7 makes it so that transforms aren't
    // applied if the element isn't visible at the time that
    // the transform is set, so we'll wait until the modal is
    // fully shown before setting the transform.
    var movableTransform = this.state.isShown
                           ? 'translate(' + movingSprite.x + 'px, ' +
                                            movingSprite.y + 'px)'
                           : '';

    var movableStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: this.state.isShown ? 1 : 0,
      transition: 'opacity 0.25s',
      webkitTransition: 'opacity 0.25s',
      mozTransition: 'opacity 0.25s',
      backgroundColor: 'rgba(0, 255, 0, 0.25)',
      transform: movableTransform,
      webkitTransform: movableTransform,
      mozTransform: movableTransform
    };

    return (
      <Modal title={"Set position for " + sprite.name} onCancel={this.props.onCancel} onSave={this.handleSave} onFinished={this.props.onFinished} onShown={this.handleShown}>
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
        <div className="row">
          <div className="col-xs-6 form-group">
            <label>X</label>
            <input ref="x" className="form-control" type="text" defaultValue={sprite.x} onChange={this.handleChangeNumber.bind(null, 'x')} onBlur={this.handleBlurNumber.bind(null, 'x')}/>
          </div>
          <div className="col-xs-6">
            <label>Y</label>
            <input ref="y" className="form-control" type="text" defaultValue={sprite.y} onChange={this.handleChangeNumber.bind(null, 'y')} onBlur={this.handleBlurNumber.bind(null, 'y')}/>
          </div>
        </div>
      </Modal>
    );
  }
});
