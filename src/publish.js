define(function(require) {
  var $ = require('jquery');

  var DEFAULT_TIMEOUT = 20000;
  var DEFAULT_HACKPUB = '//hackpub.herokuapp.com/buckets/minicade/';

  return function publish(options, cb) {
    var html = options.html;
    var originalURL = options.originalURL;
    var hackpubURL = options.hackpubURL || DEFAULT_HACKPUB;
    var timeout = options.timeout || DEFAULT_TIMEOUT;

    return $.ajax({
      type: 'POST',
      timeout: timeout,
      url: hackpubURL + "publish",
      data: {
        'html': html,
        'original-url': originalURL
      },
      crossDomain: true,
      dataType: 'json',
      error: function(jqXHR, textStatus, errorThrown) {
        var message = textStatus;
        if (message == 'error' && typeof(errorThrown) == 'string')
          message = errorThrown;
        if (jqXHR.status)
          message += " (HTTP " + jqXHR.status + ")";
        cb(new Error(message));
      },
      success: function(data, textStatus, jqXHR) {
        cb(null, data['published-url']);
      }
    });
  };
});
