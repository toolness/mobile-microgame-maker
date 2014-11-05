var Editor = React.createClass({
  getInitialState: function() {
    return {
      gameData: this.props.initialGameData
    };
  },
  componentDidMount: function() {
    // For debugging via console only!
    window.editor = this;
  },
  handleAddSprite: function() {
    this.setState(React.addons.update(this.state, {
      gameData: {
        sprites: {
          $push: [{
            id: guid(),
            x: 100,
            y: 100,
            key: 'fly',
            animation: 'flying'
          }]
        }
      }
    }));
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
    this.setState(React.addons.update(this.state, {
      gameData: {
        sprites: {
          $splice: [[this.spriteIndex(id), 1]]
        }
      }
    }));
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
        <button className="btn btn-default" onClick={this.handleAddSprite}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </div>
    );
  }
});
