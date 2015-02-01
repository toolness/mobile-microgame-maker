define(function(require) {
  var React = require('react');
  var Blockly = require('blockly');

  var BlocklyComponent = React.createClass({
    getInitialState: function() {
      return {
        showJsPanel: false,
        js: ''
      };
    },
    componentDidMount: function() {
      Blockly.inject(this.refs.blockly.getDOMNode(), {
        path: 'vendor/blockly/',
        toolbox: this.props.toolbox
      });
      Blockly.addChangeListener(this.handleBlocklyChange);
    },
    componentWillUnmount: function() {
      Blockly.removeChangeListener(this.handleBlocklyChange);
      // TODO: Un-inject Blockly?
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (this.state.showJsPanel != prevState.showJsPanel) {
        Blockly.fireUiEvent(window, 'resize');
        if (this.state.showJsPanel)
          this.handleBlocklyChange();
      }
    },
    handleBlocklyChange: function() {
      if (!this.state.showJsPanel) return;
      var js = Blockly.JavaScript.workspaceToCode();
      this.setState({
        js: js
      });
    },
    handleToggleJsPanel: function() {
      this.setState({
        showJsPanel: !this.state.showJsPanel
      });
    },
    render: function() {
      return (
        <div className={React.addons.classSet({
          "blockly-fill-page": true,
          "blockly-js-expanded": this.state.showJsPanel
        })}>
          <div className="blockly-panel" ref="blockly"></div>
          <div className="blockly-js-panel">
            <p>Below is the <a href="http://phaser.io/" target="_blank">Phaser</a>-based JavaScript translation for your Blockly code.</p>
            <pre>{this.state.js}</pre>
            <p>
              <small><strong>Note: </strong>
              This isn't all the code for your minigame. To see the full code, export your minigame to HTML via the <span className="glyphicon glyphicon-flash"></span> <strong>MOAR</strong> button in the main editor.
              </small></p>
          </div>
          <div className="blockly-js-toggle" onClick={this.handleToggleJsPanel}>JS <span className="caret"></span></div>
          <div className="close-box" onClick={this.props.onClose}>&times;</div>
        </div>
      );
    }
  });

  return BlocklyComponent;
});
