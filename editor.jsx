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
            x: 100,
            y: 100,
            key: 'fly',
            animation: 'flying'
          }]
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
        {this.state.gameData.sprites.map(function(sprite, i) {
          return <li className="list-group-item" key={i}>{sprite.key} @ {sprite.x}, {sprite.y}</li>
        })}
        </ul>
        <button className="btn btn-default" onClick={this.handleAddSprite}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </div>
    );
  }
});
