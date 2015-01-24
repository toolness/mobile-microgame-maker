var fs = require('fs');
var buildCss = require('./build-css');

function listFiles(dirname) {
  var list = [];
  var files = fs.readdirSync(dirname);
  files.forEach(function(filename) {
    var fullPath = dirname + '/' + filename;
    var stats = fs.statSync(fullPath);
    if (stats.isDirectory())
      list.push.apply(list, listFiles(fullPath));
    else
      list.push(fullPath);
  });

  return list;
}

function get(now) {
  now = now || new Date();
  return [
    'CACHE MANIFEST',
    '# ' + now.toString(),
    '',
    'CACHE:',
    'index.html',
    'phaser-frame.html',
    'startup-manager.js',
    'main.js',
    'require-config.js',
    buildCss.OUTPUT_FILENAME,
    'vendor/require.js',
    'vendor/require.text.js', // Note sure why this needs to be loaded, but
                              // it shows up in the network log on optimized
                              // builds...
    'vendor/phaser.js',
    'vendor/bootstrap/css/bootstrap.css',
    'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff'
  ].concat(listFiles('vendor/blockly/media'))
   .concat(listFiles('assets'))
   .concat(listFiles('fonts'))
   .concat([
    '',
    'NETWORK:',
    '*'
  ])
   .join('\n') + '\n';
}

module.exports = get;

if (!module.parent)
  console.log(get());
