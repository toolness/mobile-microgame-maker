define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');
  var Export = require('../export');
  var publish = require('../publish');

  // Give the user some time to cancel the modal.
  var PUBLISH_DELAY = 3000;

  return React.createClass({
    getInitialState: function() {
      return {
        publishDelay: null,
        publishXHR: null,
        publishError: null,
        publishedURL: null
      };
    },
    componentDidMount: function() {
      this.setState({
        publishDelay: window.setTimeout(this.startPublish, PUBLISH_DELAY)
      });
    },
    componentWillUnmount: function() {
      this.isUnmounting = true;
      window.clearTimeout(this.state.publishDelay);
      if (this.state.publishXHR) this.state.publishXHR.abort();
      delete this.isUnmounting;
    },
    startPublish: function() {
      this.setState({
        publishDelay: null,
        publishXHR: publish({
          html: Export.toHtml(this.props.gameData, {
            encourageRemix: true
          }),
          // TODO: Actually set export URL!
          originalURL: 'http://example.org/'
        }, function(err, publishedURL) {
          if (!this.isMounted() || this.isUnmounting) return;
          if (err) {
            this.setState({
              publishXHR: null,
              publishError: err
            });
          } else {
            this.setState({
              publishXHR: null,
              publishedURL: publishedURL
            });
          }
        }.bind(this))
      });
    },
    render: function() {
      var content;

      if (this.state.publishedURL) {
        content = (
          <div>
            <p>Your minigame is published at:</p>
            <div className="well">
            <a href={this.state.publishedURL} target="_blank" style={{
              fontSize: '1.5em',
              wordWrap: 'break-word'
            }}>
              {this.state.publishedURL}
            </a>
            </div>
            <p>Please note that, as this software is still highly
              experimental, your published game can disappear at
              any time.</p>
          </div>
        );
      } else if (this.state.publishError) {
        content = (
          <div>
          <p>An error occurred while publishing:</p>
          <pre>{this.state.publishError.message}</pre>
          <p>Sorry! Please try again later.</p>
          </div>
        );
      } else {
        content = (
          <p>Publishing, please wait&hellip;</p>
        );
      }

      return (
        <Modal title="Publish Your Minigame" onFinished={this.props.onFinished} hideSaveButton>
          {content}
        </Modal>
      );
    }
  });
});
