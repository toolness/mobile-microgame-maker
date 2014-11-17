var ImportModal = React.createClass({
  getInitialState: function() {
    return {gameData: null};
  },
  handleChange: function(e) {
    this.setState({
      gameData: Export.fromHtml(e.target.value)
    });
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
