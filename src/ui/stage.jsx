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
      var hardReset = !newState || (this.iframe && !this.game);

      if (this.game && this.game.canvas && newState) {
        this.refs.placeholder.getDOMNode().getContext('2d').drawImage(
          this.game.canvas,
          0,
          0
        );
      }

      if (this.iframe && hardReset) {
        this.iframe.parentNode.removeChild(this.iframe);
        this.iframe = null;
        this.game = null;
      }

      if (!newState) return;

      var self = this;
      var originalCreate = newState.create;
      var document = this.refs.phaser.getDOMNode().ownerDocument;

      newState.create = function() {
        self.setState({loading: false});
        originalCreate.apply(this, arguments);
      };

      if (!this.iframe) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('src', 'phaser-frame.html');
        iframe.onload = function() {
          var Phaser = iframe.contentWindow.Phaser;
          newState.Phaser = Phaser;
          newState.id = 1;
          self.game = new Phaser.Game(
            self.props.width,
            self.props.height,
            Phaser.CANVAS,
            iframe.contentDocument.body,
            null
          );
          self.game.state.add(newState.id.toString(), newState, true);
        };
        this.refs.phaser.getDOMNode().appendChild(iframe);
        iframe.style.width = this.props.width + 'px';
        iframe.style.height = this.props.height + 'px';
        iframe.style.border = 'none';

        this.iframe = iframe;
      } else {
        var oldState = this.game.state.getCurrentState();
        newState.Phaser = oldState.Phaser;
        newState.id = oldState.id + 1;
        this.game.state.add(newState.id.toString(), newState, true);
        this.game.state.remove(oldState.id.toString());
        this.game.paused = false;
        this.game.input.disabled = false;
      }
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
      var scale = this.props.scale || 1;
      return (
        <div style={{height: this.props.height * scale, overflow: 'hidden'}}>
        <div style={{transform: 'scale(' + scale + ')', transformOrigin: '0 0'}}>
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
        </div>
        </div>
      );    
    }
  });

  return Stage;
});
