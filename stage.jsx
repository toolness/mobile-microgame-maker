var Stage = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    phaserState: React.PropTypes.object
  },
  setPhaserState: function(newState) {
    var oldGame = this.game;
    var stateWrapper = Object.create(newState);

    stateWrapper.create = function() {
      newState.create.apply(this, arguments);
      if (oldGame && oldGame.isBooted) {
        oldGame.destroy();
        oldGame = null;
      }
    };

    stateWrapper.preload = function() {
      newState.preload.apply(this, arguments);
      if (oldGame && oldGame.canvas) {
        $(oldGame.canvas).css({
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: '1'
        });
      }
    };

    // http://docs.phaser.io/Phaser.Game.html
    this.game = new Phaser.Game(
      this.props.width,
      this.props.height,
      Phaser.CANVAS,
      this.refs.phaser.getDOMNode(),
      stateWrapper
    );
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
      <div style={{position: 'relative'}} ref="phaser"></div>
    );    
  }
});
 