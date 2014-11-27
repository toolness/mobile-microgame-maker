define(function(require) {
  var React = require('react');
  var Export = require('./export');
  var Modal = require('jsx!./modal');

  var ExportModal = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
      return {encourageRemix: true};
    },
    handleChange: function(e) {
      // We're only defining this so React doesn't warn us about the field
      // being read-only; we don't want to set readOnly on the textarea b/c
      // then the user can't select the text!
      e.preventDefault();
    },
    render: function() {
      var exportedHtml = Export.toHtml(this.props.gameData, {
        encourageRemix: this.state.encourageRemix
      });
      return (
        <Modal title="Export to HTML" hideSaveButton onFinished={this.props.onFinished}>
          <p>Here is the HTML for your Minigame.</p>
          <textarea className="form-control" rows="15" style={{fontFamily: 'monospace'}} spellCheck="false" onChange={this.handleChange} value={exportedHtml}></textarea>
          <div className="checkbox">
            <label>
              <input type="checkbox" checkedLink={this.linkState('encourageRemix')}/> Allow code to be re-imported into this tool
            </label>
          </div>
        </Modal>
      );
    }
  });

  return ExportModal;
});
