define(function(require) {
  var React = require('react');
  var Export = require('../../export');
  var Modal = require('jsx!./modal');

  var ImportModal = React.createClass({
    getInitialState: function() {
      return {latestValue: null, gameData: null};
    },
    handleChange: function(e) {
      var value = e.target.value;
      this.setState({latestValue: value, gameData: null});
      Export.fromHtml(value, function(err, gameData) {
        if (err)
          return console.log(err);
        if (!this.isMounted() || this.state.latestValue != value)
          return;
        this.setState({gameData: gameData});
      }.bind(this));
    },
    handleSave: function() {
      this.props.onSave(this.state.gameData);
    },
    render: function() {
      return (
        <Modal title="Import from HTML" onFinished={this.props.onFinished} onSave={this.state.gameData ? this.handleSave : null} saveLabel="Import">
          <p>Paste in the HTML of a minigame below to load it into this editor.</p>
          <textarea className="form-control" rows="15" style={{fontFamily: 'monospace'}} spellCheck="false" onChange={this.handleChange}></textarea>
        </Modal>
      );
    }
  });

  return ImportModal;
});
