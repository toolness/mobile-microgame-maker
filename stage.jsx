define(function(require) {
  var React = require('react');

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
        try {
          this.game.destroy();
        } catch (e) {
          // This seems to happen sometimes, perhaps b/c the game
          // wasn't yet fully initialized by the time we try to
          // destroy it? Either way, it's probably not a big deal
          // since the game is in an iframe that will be destroyed,
          // so just log the error and move on.
          console.log("error when destroying Phaser game", e);
        }
        this.game = null;
      }

      if (this.iframe) {
        this.iframe.parentNode.removeChild(this.iframe);
        this.iframe = null;
      }

      if (!newState) return;

      var self = this;
      var originalCreate = newState.create;
      var document = this.refs.phaser.getDOMNode().ownerDocument;
      var iframe = document.createElement('iframe');

      newState.create = function() {
        self.setState({loading: false});
        originalCreate.apply(this, arguments);
      };

      iframe.setAttribute('src', 'phaser-frame.html');
      iframe.onload = function() {
        var Phaser = iframe.contentWindow.Phaser;
        newState.Phaser = Phaser;
        self.game = new Phaser.Game(
          self.props.width,
          self.props.height,
          Phaser.CANVAS,
          iframe.contentDocument.body,
          newState
        );
      };
      this.refs.phaser.getDOMNode().appendChild(iframe);
      iframe.style.width = this.props.width + 'px';
      iframe.style.height = this.props.height + 'px';
      iframe.style.border = 'none';

      this.iframe = iframe;
      this.setState({loading: true});
    },
    componentDidUpdate: function(prevProps) {
      if (prevProps.phaserState !== this.props.phaserState)
        this.setPhaserState(this.props.phaserState);
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
            top: 0,
            left: 0,
            zIndex: '1',
            display: this.state.loading ? 'block' : 'none'
          }}
        /><div ref="phaser"/></div>
      );    
    }
  });

  return Stage;
});
