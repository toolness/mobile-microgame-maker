define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');
  var CssSprite = require('jsx!./css-sprite');

  return React.createClass({
    handleSave: function() {
      this.props.onSave(this.state.spritesheet, this.state.animation);
    },
    handleSpriteClick: function(spritesheet, animation) {
      this.setState({spritesheet: spritesheet, animation: animation});
      this.refs.modal.handleSave();
    },
    render: function() {
      var gameData = this.props.gameData;

      return (
        <Modal ref="modal" title="Choose a spritesheet" onCancel={this.props.onCancel} onSave={this.handleSave} onFinished={this.props.onFinished} hideSaveButton>
          {gameData.spritesheets.map(function(ss) {
            var animation = gameData.animations[ss.key][0].name;
            var sprite = {key: ss.key, animation: animation};
            return <div key={ss.key} style={{
              display: 'inline-block',
              padding: 4,
              cursor: 'pointer'
            }} title={ss.key} onClick={this.handleSpriteClick.bind(this, ss, animation)}><CssSprite gameData={gameData} sprite={sprite} maxDimension={64}/></div>;
          }, this)}
        </Modal>
      );
    }
  });
});
