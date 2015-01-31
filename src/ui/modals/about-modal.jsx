define(function(require) {
  var React = require('react');
  var Modal = require('jsx!./modal');

  return React.createClass({
    cacheEvents: ['cached', 'checking', 'downloading', 'error', 'noupdate',
                  'obsolete', 'progress', 'updateready'],
    getInitialState: function() {
      return {
        appCacheStatus: this.appCacheStatusAsString(),
        version: null
      };
    },
    // http://www.html5rocks.com/en/tutorials/appcache/beginner/
    appCacheStatusAsString: function() {
      var appCache = window.applicationCache;

      switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
          return 'UNCACHED';
          break;
        case appCache.IDLE: // IDLE == 1
          return 'IDLE';
          break;
        case appCache.CHECKING: // CHECKING == 2
          return 'CHECKING';
          break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
          return 'DOWNLOADING';
          break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 4
          return 'UPDATEREADY';
          break;
        case appCache.OBSOLETE: // OBSOLETE == 5
          return 'OBSOLETE';
          break;
        default:
          return 'UKNOWN CACHE STATUS';
          break;
      };
    },
    handleCacheEvent: function() {
      this.setState({
        appCacheStatus: this.appCacheStatusAsString()
      });
    },
    componentDidMount: function() {
      var appCache = window.applicationCache;
      var doc = this.getDOMNode().ownerDocument;
      this.setState({
        appCacheStatus: this.appCacheStatusAsString(),
        version: doc.documentElement.getAttribute('data-build-date'),
        gitCommit: window.GIT_COMMIT
      });
      this.cacheEvents.forEach(function(type) {
        appCache.addEventListener(type, this.handleCacheEvent, false);
      }, this);
    },
    componentWillUnmount: function() {
      var appCache = window.applicationCache;
      this.cacheEvents.forEach(function(type) {
        appCache.removeEventListener(type, this.handleCacheEvent, false);
      }, this);
    },
    render: function() {
      return (
        <Modal title="&nbsp;" onFinished={this.props.onFinished} hideSaveButton>
          <div style={{textAlign: 'center'}}>
            <h2>Make A Minigame</h2>
            <p>{this.state.version
                ? 'Version ' + this.state.version
                : 'Development Version'}
                {this.state.gitCommit
                 ? <span> / <a target="_blank" href={"https://github.com/toolness/mobile-microgame-maker/commit/" + this.state.gitCommit}>
                     {this.state.gitCommit.slice(0, 10)}</a></span>
                 : null}
            </p>
            {this.state.appCacheStatus == 'UPDATEREADY'
             ? <p><button className="btn btn-awsm" onClick={window.location.reload.bind(window.location)}>
                 Update App
               </button></p>
             : null}
            <p><button className="btn btn-sm btn-awsm btn-awsmblue" onClick={this.props.onReset}>Reset App&hellip;</button></p>
            <p className="text-muted"><small>App cache status: <code>{this.state.appCacheStatus}</code></small></p>
          </div>
        </Modal>
      );
    }
  });
});
