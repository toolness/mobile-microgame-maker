var ExportModal = React.createClass({
  render: function() {
    var exportedHtml = Export.toHtml(this.props.gameData);
    return (
      <Modal title="Export to HTML" hideSaveButton onFinished={this.props.onFinished}>
        <p>Here is the HTML for your Minigame.</p>
        <textarea className="form-control" rows="15" style={{fontFamily: 'monospace'}} spellCheck="false" value={exportedHtml}></textarea>
      </Modal>
    );
  }
});
