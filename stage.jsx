var Stage = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    phaserState: React.PropTypes.object
  },
  componentDidMount: function() {
    // http://docs.phaser.io/Phaser.Game.html
    var game = this.game = new Phaser.Game(
      this.props.width,
      this.props.height,
      Phaser.AUTO,
      this.refs.phaser.getDOMNode(),
      this.props.phaserState
    );
  },
  componentWillUnmount: function() {
    this.game.destroy();
  },
  render: function() {
    return (
      <div ref="phaser"></div>
    );    
  }
});
 