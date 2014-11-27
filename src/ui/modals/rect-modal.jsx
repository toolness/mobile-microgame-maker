define(function(require) {
  var Hammer = require('hammer');
  var React = require('react');
  var PhaserState = require('../../phaser-state');
  var Modal = require('jsx!./modal');
  var Stage = require('jsx!../stage');

  var RectModal = React.createClass({
    makePhaserState: function(gameData) {
      return {
        preload: function() {
          PhaserState.Generators.makeFunc('preload', gameData)(this.game);
        },
        create: function() {
          PhaserState.Generators.makeFunc('createSprites', gameData)(this);
          this.game.stage.backgroundColor = gameData.backgroundColor;
          this.game.paused = true;
        }
      };
    },
    getInitialState: function() {
      return {
        phaserState: this.makePhaserState(this.props.gameData),
        rect: this.props.initialRect,
        rectAnchor: null
      };
    },
    componentDidMount: function() {
      var surface = this.refs.surface.getDOMNode();
      var hammer = this.hammer = new Hammer(surface);

      hammer.on('panstart', function(e) {
        var bounds = surface.getBoundingClientRect();
        this.setState({
          rectAnchor: {
            x: e.center.x - bounds.left,
            y: e.center.y - bounds.top
          }
        });
      }.bind(this));
      hammer.on('panmove', function(e) {
        var anchor = this.state.rectAnchor;
        this.setState({
          rect: {
            left: e.deltaX < 0 ? anchor.x + e.deltaX : anchor.x,
            top: e.deltaY < 0 ? anchor.y + e.deltaY : anchor.y,
            width: Math.abs(e.deltaX),
            height: Math.abs(e.deltaY)
          }
        });
      }.bind(this));
      hammer.on('panend', function(e) {
        this.setState({rectAnchor: null});
      }.bind(this));
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    handleSave: function() {
      this.props.onSave(this.state.rect);
    },
    render: function() {
      var gameData = this.props.gameData;
      var rect = this.state.rect;

      return (
        <Modal title="Draw a rectangle" onCancel={this.props.onCancel} onSave={this.handleSave} onFinished={this.props.onFinished}>
          <div style={{textAlign: 'center'}}>
            <div style={{
              display: 'inline-block',
              position: 'relative',
              width: gameData.width,
              marginLeft: -20,
              marginRight: -20
            }}>
              <div style={{opacity: 0.5, pointerEvents: 'none'}}>
                <Stage ref="stage" width={gameData.width} height={gameData.height} phaserState={this.state.phaserState}/>
              </div>
              <div ref="surface" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: gameData.width,
                height: gameData.height,
              }}>
                <div ref="rect" style={{
                  position: 'absolute',
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  border: '1px solid red',
                  pointerEvents: 'none'
                }}></div>
              </div>
            </div>
            <p>Just drag a rectangle.</p>
          </div>
        </Modal>
      );
    }
  });

  return RectModal;
});
