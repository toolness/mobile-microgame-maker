define(function(require) {
  var React = require('react');
  var Sprite = require('jsx!./sprite');

  var HIGHLIGHTED_SPRITE_MS = 1000;

  var SpriteList = React.createClass({
    getInitialState: function() {
      return {
        highlightedSprite: null
      };
    },
    highlightSprite: function(id) {
      var sprite = this.refs['sprite-' + id];
      if (!sprite) return;
      this.setState({
        highlightedSprite: id
      });
      window.clearTimeout(this.highlightedSpriteTimeout);
      this.highlightedSpriteTimeout = window.setTimeout(function() {
        this.setState({highlightedSprite: null});
      }.bind(this), HIGHLIGHTED_SPRITE_MS);
      sprite.getDOMNode().scrollIntoView();
    },
    componentWillUnmount: function() {
      window.clearTimeout(this.highlightedSpriteTimeout);
    },
    render: function() {
      return (
        <ul className="list-group">
        {this.props.gameData.sprites.map(function(sprite) {
          return <Sprite
                  sprite={sprite}
                  ref={"sprite-" + sprite.id}
                  key={sprite.id}
                  gameData={this.props.gameData}
                  onRemove={this.props.onRemove}
                  onChange={this.props.onChange}
                  modalManager={this.props.modalManager}
                  highlighted={this.state.highlightedSprite == sprite.id}/>;
        }, this)}
        </ul>
      );
    }
  });

  return SpriteList;
});