define(function(require) {
  var $ = require('jquery');

  var DEFAULT_TIMEOUT = 20000;
  var DEFAULT_HACKPUB = '//hackpub.herokuapp.com/buckets/minicade/';
  var DEFAULT_WARMUP_INTERVAL = 180 * 1000;

  var publish = function publish(options, cb) {
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

  // If the hackpub endpoint is hosted by Heroku's free hosting, there's
  // a chance that it may be asleep if nobody's published anything in
  // the past hour. This function pings it every so often, so that when
  // the user actually wants to publish, we don't time out waiting for
  // the service to wake up.
  publish.warmup = function(hackpubURL, interval) {
    var pingHackpub = function() {
      var req = new XMLHttpRequest();
      req.onload = function() {
        console.log("Hackpub endpoint " + hackpubURL + " is warmed up.");
      };
      req.open('GET', hackpubURL);
      req.send(null);
    };

    hackpubURL = hackpubURL || DEFAULT_HACKPUB;
    interval = interval || DEFAULT_WARMUP_INTERVAL;

    window.setInterval(pingHackpub, interval);
    window.setTimeout(pingHackpub, 0);
  };

  return publish;
});
