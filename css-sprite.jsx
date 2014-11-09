var CssSprite = React.createClass({
  render: function() {
    try {
      var sprite = this.props.sprite;
      var gameData = this.props.gameData;
      var spritesheet = _.findWhere(gameData.spritesheets, {
        key: sprite.key
      });
      var frame = _.findWhere(gameData.animations[sprite.key], {
        name: sprite.animation
      }).frames[0];
    } catch (e) {
      console.log('Unable to load sprite', sprite.name,
                  sprite.key + '/' + sprite.animation, e);
      return <div></div>;
    }

    return (
      <div style={{
        width: spritesheet.frameWidth,
        height: spritesheet.frameHeight,
        backgroundImage: 'url(' + spritesheet.url + ')',
        backgroundPosition: -(frame * spritesheet.frameWidth) + 'px 0px'
      }}></div>
    );
  }
});
