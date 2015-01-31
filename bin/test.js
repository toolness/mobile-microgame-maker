var http = require('http');
var resolveUrl = require('url').resolve;
var qunit = require('node-qunit-phantomjs');

var app = require('./server');
var server = http.createServer(app);

function runTests(url) {
  server.listen(function() {
    var baseURL = 'http://localhost:' + server.address().port;
    qunit(resolveUrl(baseURL, url), {
      verbose: true
    }, function(code) {
      server.close();
      console.log("exiting with code", code);
      process.exit(code);
    });
  });
}

module.exports = runTests;

if (!module.parent)
  runTests(process.argv[2] || '/test/index.html');
