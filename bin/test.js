var http = require('http');
var qunit = require('node-qunit-phantomjs');

var app = require('./server');
var server = http.createServer(app);

server.listen(function() {
  var baseURL = 'http://localhost:' + server.address().port;
  qunit(baseURL + '/test/index.html', {
    verbose: true
  }, function(code) {
    server.close();
    console.log("exiting with code", code);
    process.exit(code);
  });
});
