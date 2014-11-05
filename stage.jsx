var Stage = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    phaserState: React.PropTypes.object
  },
  getInitialState: function() {
    return {loading: true};
  },
  setPhaserState: function(newState) {
    if (this.game) {
      if (this.game.canvas) {
        this.refs.placeholder.getDOMNode().getContext('2d').drawImage(
          this.game.canvas,
          0,
          0
        );
      }
      this.game.destroy();
      this.game = null;
    }

    if (!newState) return;

    var self = this;
    var stateWrapper = Object.create(newState);

    stateWrapper.create = function() {
      self.setState({loading: false});
      newState.create.apply(this, arguments);
    };

    // http://docs.phaser.io/Phaser.Game.html
    this.game = new Phaser.Game(
      this.props.width,
      this.props.height,
      Phaser.CANVAS,
      this.refs.phaser.getDOMNode(),
      stateWrapper
    );
    this.setState({loading: true});
  },
  componentDidMount: function() {
    this.setPhaserState(this.props.phaserState);
  },
  componentWillUnmount: function() {
    this.setPhaserState(null);
  },
  render: function() {
    return (
      <div style={{
        position: 'relative',
        width: this.props.width + 'px',
        height: this.props.height + 'px'
      }}><canvas
        ref="placeholder"
        width={this.props.width}
        height={this.props.height}
        style={{
          position: 'absolute',
          top: '0px',
          left: '0px',
          zIndex: '1',
          display: this.state.loading ? 'block' : 'none'
        }}
      /><div ref="phaser"/></div>
    );    
  }
});
 