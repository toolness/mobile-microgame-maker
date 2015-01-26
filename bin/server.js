var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var prettyData = require('pretty-data').pd;
var stableStringify = require('json-stable-stringify');

var buildOptimized = require('./build-optimized');
var buildCss = require('./build-css');

var PORT = process.env.PORT || 3000;
var EXAMPLES_DIR = __dirname + '/../examples';

var app = express();

app.param('name', function(req, res, next, name) {
  if (!/^[A-Za-z0-9_\-]+$/.test(name))
    return next('route');
  req.name = name;
  next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res, next) {
  res.send(buildOptimized.loadIndexWithHtmlAttrs({
    'data-using-dev-server': true
  }));
});

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

app.get('/examples/:name', function(req, res, next) {
  var name = req.name;
  if (!fs.existsSync(EXAMPLES_DIR + '/' + name + '.html'))
    return res.status(404).send("Example " + name + " does not exist!");

  var gameData = fs.readFileSync(EXAMPLES_DIR + '/' + name + '.json',
                                 'utf-8');
  var blocklyXml = fs.readFileSync(EXAMPLES_DIR + '/' + name + '.xml',
                                   'utf-8');

  gameData = JSON.parse(gameData);
  gameData.blocklyXml = blocklyXml;

  return res.send(gameData);
});

app.post('/examples/:name', function(req, res, next) {
  var basename = EXAMPLES_DIR + '/' + req.name;
  var gameData = JSON.parse(req.body.gameData);

  fs.writeFileSync(basename + '.html', req.body.html);
  var blocklyXml = gameData.blocklyXml;

  delete gameData.blocklyXml;
  fs.writeFileSync(basename + '.json',
                   stableStringify(gameData, {space: 2}));
  console.log('wrote', basename + '.json.');
  fs.writeFileSync(basename + '.xml',
                   prettyData.xml(blocklyXml));
  console.log('wrote', basename + '.xml.');

  res.send({status: "OK"});
});

app.use(express.static(__dirname + '/..'));

app.listen(PORT, function() {
  console.log("Listening on port", PORT);
});
