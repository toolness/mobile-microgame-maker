define(function(require) {
  var React = require('react');

  var BlocklyComponent = React.createClass({
    componentDidMount: function() {
      Blockly.inject(this.refs.blockly.getDOMNode(), {
        path: 'vendor/blockly/',
        toolbox: this.props.toolbox
      });
    },
    render: function() {
      return (
        <div className="blockly-fill-page">
          <div className="blockly-fill-page" ref="blockly"></div>
          <div className="close-box" onClick={this.props.onClose}>&times;</div>
        </div>
      );
    }
  });

  return BlocklyComponent;
});
