define(function(require) {
  var Hammer = require('hammer');
  var React = require('react');
  var PhaserState = require('../../phaser-state');
  var Modal = require('jsx!./modal');
  var Stage = require('jsx!../stage');
  var ScaleSizerMixin = require('../scale-sizer-mixin');

  var RectModal = React.createClass({
    mixins: [ScaleSizerMixin],
    getInitialState: function() {
      return {
        phaserState: null,
        scale: 0.4,
        scaleIdealWidth: this.props.gameData.width,
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
        var iScale = 1 / this.state.scale;
        this.setState({
          rect: {
            left: Math.floor((e.deltaX < 0 ? anchor.x + e.deltaX
                                           : anchor.x) * iScale),
            top: Math.floor((e.deltaY < 0 ? anchor.y + e.deltaY
                                          : anchor.y) * iScale),
            width: Math.floor(Math.abs(e.deltaX) * iScale),
            height: Math.floor(Math.abs(e.deltaY) * iScale)
          }
        });
      }.bind(this));
      hammer.on('panend', function(e) {
        this.setState({rectAnchor: null});
        this.updateFields();
      }.bind(this));
    },
    componentWillUnmount: function() {
      this.hammer.destroy();
      this.hammer = null;
    },
    handleShown: function() {
      this.handleScaleResize();
      this.setState({
        // Firefox doesn't like it if we initialize Phaser while its
        // window isn't visible, so we'll wait until it's shown.
        phaserState: PhaserState.Generators
          .makeInertStateObject(this.props.gameData)
      });
    },
    handleSave: function() {
      this.props.onSave(this.state.rect);
    },
    handleBlurNumber: function(prop, e) {
      e.target.value = this.state.rect[prop];
    },
    handleChangeNumber: function(prop, e) {
      var val = parseFloat(e.target.value);
      if (isNaN(val)) return;
      var changes = {};
      changes[prop] = {$set: val};
      this.setState(React.addons.update(this.state, {
        rect: changes
      }));
    },
    updateFields: function() {
      this.refs.top.getDOMNode().value = this.state.rect.top;
      this.refs.left.getDOMNode().value = this.state.rect.left;
      this.refs.width.getDOMNode().value = this.state.rect.width;
      this.refs.height.getDOMNode().value = this.state.rect.height;
    },
    render: function() {
      var gameData = this.props.gameData;
      var rect = this.state.rect;
      var scale = this.state.scale;

      return (
        <Modal title={this.props.title || "Draw a rectangle"} onCancel={this.props.onCancel} onSave={this.handleSave} onFinished={this.props.onFinished} onShown={this.handleShown}>
          <div ref="scaleContainer" style={{textAlign: 'center'}}>
            <div style={{
              display: 'inline-block',
              position: 'relative',
              width: gameData.width * scale
            }}>
              <div style={{opacity: 0.5, pointerEvents: 'none'}}>
                <Stage ref="stage" scale={scale} width={gameData.width} height={gameData.height} phaserState={this.state.phaserState}/>
              </div>
              <div ref="surface" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: gameData.width * scale,
                height: gameData.height * scale,
              }}>
                <div ref="rect" style={{
                  position: 'absolute',
                  top: rect.top * scale,
                  left: rect.left * scale,
                  width: rect.width * scale,
                  height: rect.height * scale,
                  border: '1px solid red',
                  pointerEvents: 'none'
                }}></div>
              </div>
            </div>
            <p>{this.props.instructions || "Just drag a rectangle."}</p>
          </div>
          <div className="row">
            <div className="col-xs-6 form-group">
              <label>Top</label>
              <input ref="top" className="form-control" type="text" defaultValue={rect.top} onChange={this.handleChangeNumber.bind(null, 'top')} onBlur={this.handleBlurNumber.bind(null, 'top')}/>
            </div>
            <div className="col-xs-6 form-group">
              <label>Left</label>
              <input ref="left" className="form-control" type="text" defaultValue={rect.left} onChange={this.handleChangeNumber.bind(null, 'left')} onBlur={this.handleBlurNumber.bind(null, 'left')}/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 form-group">
              <label>Width</label>
              <input ref="width" className="form-control" type="text" defaultValue={rect.width} onChange={this.handleChangeNumber.bind(null, 'width')} onBlur={this.handleBlurNumber.bind(null, 'width')}/>
            </div>
            <div className="col-xs-6 form-group">
              <label>Height</label>
              <input ref="height" className="form-control" type="text" defaultValue={rect.height} onChange={this.handleChangeNumber.bind(null, 'height')} onBlur={this.handleBlurNumber.bind(null, 'height')}/>
            </div>
          </div>
        </Modal>
      );
    }
  });

  return RectModal;
});
