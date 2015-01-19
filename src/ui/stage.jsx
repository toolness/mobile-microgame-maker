define(function(require) {
  var React = require('react');

  var TRANSFORM_ORIGIN = '0 0';

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

      // An apparent bug on iOS 7 makes it so that transforms aren't
      // applied if the element isn't visible at the time that
      // the transform is set. This helps us get around that bug.
      var transform = this.refs.transform.getDOMNode();
      transform.style.webkitTransform = this.getTransform();
      transform.style.webkitTransformOrigin = TRANSFORM_ORIGIN;

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
    getTransform: function() {
      return 'scale(' + (this.props.scale) + ')';
    },
    handleClick: function(e) {
      if (!(this.props.onDisplayObjectClick &&
            this.game && this.game.world)) return;

      var rect = e.target.getBoundingClientRect();
      var invScale = 1 / this.props.scale;
      var x = Math.floor((e.clientX - rect.left) * invScale);
      var y = Math.floor((e.clientY - rect.top) * invScale);

      this.game.world.children.some(function(item) {
        var point = new this.iframe.contentWindow.Phaser.Point();
        var hit = this.game.input.hitTest(item, {
          x: x,
          y: y
        }, point);
        if (hit)
          this.props.onDisplayObjectClick(item, this.props.phaserState);
        return hit;
      }, this);
    },
    render: function() {
      var scale = this.props.scale;
      var transform = this.getTransform();
      var transformStyle = {
        transform: transform,
        webkitTransform: transform,
        mozTransform: transform,
        transformOrigin: TRANSFORM_ORIGIN,
        webkitTransformOrigin: TRANSFORM_ORIGIN,
        mozTransformOrigin: TRANSFORM_ORIGIN,
      };

      return (
        <div style={{height: this.props.height * scale, overflow: 'hidden'}}>
        <div ref="transform" style={transformStyle}>
        <div style={{
          position: 'relative',
          width: this.props.width + 'px',
          height: this.props.height + 'px'
        }}>
        {this.props.capturePointerEvents
         ? <div style={{
             position: 'absolute',
             width: this.props.width,
             height: this.props.height,
             top: 0,
             left: 0,
             zIndex: '2'
           }} onClick={this.handleClick}></div>
         : null}
        <canvas
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
