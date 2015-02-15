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

function get(now, isEmpty) {
  now = now || new Date();

  var lines = [
    'CACHE MANIFEST',
    '# ' + now.toString(),
  ];

  if (!isEmpty) {
    lines = lines.concat([
      '',
      'CACHE:',
      'index.html',
      'phaser-frame.html',
      'startup-manager.js',
      'main.js',
      'require-config.js',
      'vendor/phaser-2.2.1.js',
      'vendor/FontLoader.js',
      buildCss.OUTPUT_FILENAME,
      'vendor/require.js',
      'vendor/require.text.js', // Note sure why this needs to be loaded, but
                                // it shows up in the network log on optimized
                                // builds...
      'vendor/prism.css',
      'vendor/bootstrap/css/bootstrap.css',
      'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff'
    ]).concat(listFiles('vendor/blockly/media'))
      .concat(listFiles('assets'))
      .concat(listFiles('fonts'));
  }

  return lines.concat([
    '',
    'NETWORK:',
    '*'
  ])
   .join('\n') + '\n';
}

module.exports = get;

if (!module.parent)
  console.log(get());
