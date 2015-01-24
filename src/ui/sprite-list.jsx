define(function(require) {
  var $ = require('jquery');
  var React = require('react');
  var Sprite = require('jsx!./sprite');

  var HIGHLIGHTED_SPRITE_MS = 1000;

  // This must be kept in-sync w/ the same variable in base.less.
  var NAVBAR_HEIGHT = 70;

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

      // http://css-tricks.com/snippets/jquery/smooth-scrolling/
      $('html, body').animate({
        scrollTop: $(sprite.getDOMNode()).offset().top -
                   NAVBAR_HEIGHT
      }, 500);
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
