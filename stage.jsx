var Stage = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    phaserState: React.PropTypes.object
  },
  setPhaserState: function(newState) {
    if (this.game) {
      this.game.destroy();
      this.game = null;
    }

    if (newState) {
      // http://docs.phaser.io/Phaser.Game.html
      this.game = new Phaser.Game(
        this.props.width,
        this.props.height,
        Phaser.CANVAS,
        this.refs.phaser.getDOMNode(),
        newState
      );
    }
  },
  componentDidMount: function() {
    this.setPhaserState(this.props.phaserState);
  },
  componentWillUnmount: function() {
    this.game.destroy();
    this.game = null;
  },
  render: function() {
    return (
      <div ref="phaser"></div>
    );    
  }
});
 