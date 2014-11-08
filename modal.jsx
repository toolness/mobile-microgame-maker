var Modal = React.createClass({
  $modal: function() {
    return $(this.refs.modal.getDOMNode());
  },
  getInitialState: function() {
    return {saveChanges: false};
  },
  componentDidMount: function() {
    this.$modal().modal().on('hidden.bs.modal', this.handleModalHidden);
  },
  componentWillUnmount: function() {
    this.$modal().data('bs.modal', null).off('hidden.bs.modal', this.handleModalHidden);
  },
  handleModalHidden: function() {
    if (this.state.saveChanges && this.props.onSave)
      return this.props.onSave();
    this.props.onCancel();
  },
  handleSave: function() {
    this.setState({saveChanges: true});
    this.$modal().modal('hide');
  },
  render: function() {
    return (
      <div className="modal fade" ref="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              <h4 className="modal-title">{this.props.title}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" disabled={!this.props.onSave} onClick={this.handleSave}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
