var express = require('express');
var buildCss = require('./build-css');

var PORT = process.env.PORT || 3000;

var app = express();

app.get('/css/base.css', function(req, res, next) {
  buildCss(function(err) {
    if (err) {
      console.log('Error building css.');
      console.log(err);
      res.type('text/css');
      return res.send('/* ERROR: ' + err.message + ' */\n' +
                      'html, body { background: red; }');
    }
    next('route');
  });
});

app.use(express.static(__dirname + '/..'));

app.listen(PORT, function() {
  console.log("Listening on port", PORT);
});
