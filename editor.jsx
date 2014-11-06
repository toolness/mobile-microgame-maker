var Editor = React.createClass({
  getInitialState: function() {
    return {
      undo: [],
      redo: [],
      gameData: this.props.initialGameData
    };
  },
  changeGameData: function(changes) {
    this.setState(React.addons.update(this.state, {
      undo: {$push: [this.state.gameData]},
      redo: {$set: []},
      gameData: changes
    }));    
  },
  handleAddSprite: function() {
    var spritesheet = this.state.gameData.spritesheets[0];
    var animation = this.state.gameData.animations[spritesheet.key][0];

    this.changeGameData({
      sprites: {
        $push: [{
          id: guid(),
          x: _.random(this.state.gameData.width - spritesheet.frameWidth),
          y: _.random(this.state.gameData.height - spritesheet.frameHeight),
          key: spritesheet.key,
          animation: animation.name
        }]
      }
    });
  },
  spriteIndex: function(id) {
    var index = -1;
    this.state.gameData.sprites.some(function(sprite, i) {
      if (sprite.id === id) {
        index = i;
        return true;
      }
    });
    return index;
  },
  handleRemoveSprite: function(id) {
    this.changeGameData({
      sprites: {
        $splice: [[this.spriteIndex(id), 1]]
      }
    });
  },
  handleUndo: function() {
    this.setState(React.addons.update(this.state, {
      undo: {$splice: [[-1, 1]]},
      redo: {$push: [this.state.gameData]},
      gameData: {$set: this.state.undo[this.state.undo.length - 1]}
    }));
  },
  handleRedo: function() {
    this.setState(React.addons.update(this.state, {
      undo: {$push: [this.state.gameData]},
      redo: {$splice: [[-1, 1]]},
      gameData: {$set: this.state.redo[this.state.redo.length - 1]}
    }));
  },
  handleCode: function() {
    var iframe = this.props.onShowFrame('blockly.html?cacheBust=' + Date.now());
  },
  render: function() {
    return (
      <div>
        <Player gameData={this.state.gameData}/>
        <br/>
        <ul className="list-group">
        {this.state.gameData.sprites.map(function(sprite) {
          return <Sprite sprite={sprite} key={sprite.id} onRemove={this.handleRemoveSprite} />
        }, this)}
        </ul>
        <div className="btn-group">
          <button type="button" className="btn btn-default" onClick={this.handleAddSprite}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
          <button type="button" className="btn btn-default" disabled={!this.state.undo.length} onClick={this.handleUndo}>
            Undo
          </button>
          <button type="button" className="btn btn-default" disabled={!this.state.redo.length} onClick={this.handleRedo}>
            Redo
          </button>
          <button type="button" className="btn btn-default" onClick={this.handleCode}>
            Code&hellip;
          </button>
        </div>
      </div>
    );
  }
});
