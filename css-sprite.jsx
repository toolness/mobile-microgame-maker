define(function(require) {
  var _ = require('underscore');
  var React = require('react');
  var GameData = require('game-data');

  var CssSprite = React.createClass({
    render: function() {
      var sprite, gameData, spritesheet, frame;

      try {
        sprite = this.props.sprite;
        gameData = this.props.gameData;
        spritesheet = _.findWhere(gameData.spritesheets, {
          key: sprite.key
        });
        frame = _.findWhere(gameData.animations[sprite.key], {
          name: sprite.animation
        }).frames[0];
      } catch (e) {
        console.log('Unable to load sprite', sprite.name,
                    sprite.key + '/' + sprite.animation, e);
        return <div></div>;
      }

      var frameWidth = spritesheet.frameWidth;
      var frameHeight = spritesheet.frameHeight;
      var url = GameData.resolveURL(gameData, spritesheet.url);

      if (this.props.maxDimension) {
        if (frameWidth > frameHeight) {
          frameHeight = frameHeight / frameWidth * this.props.maxDimension;
          frameWidth = this.props.maxDimension;
        } else {
          frameWidth = frameWidth / frameHeight * this.props.maxDimension;
          frameHeight = this.props.maxDimension;
        }
      }

      return (
        <div style={{
          width: frameWidth,
          height: frameHeight,
          backgroundSize: 'auto ' + frameHeight + 'px',
          backgroundImage: 'url(' + url + ')',
          backgroundPosition: -(frame * frameWidth) + 'px 0px'
        }}></div>
      );
    }
  });

  return CssSprite;
});
