var fs = require('fs');

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
    'main.js',
    'require-config.js',
    'vendor/require.js',
    'vendor/require.text.js', // Note sure why this needs to be loaded, but
                              // it shows up in the network log on optimized
                              // builds...
    'vendor/phaser.js',
    'vendor/bootstrap/css/bootstrap.css',
    'vendor/bootstrap/fonts/glyphicons-halflings-regular.woff'
  ].concat(listFiles('vendor/blockly/media'))
   .concat(listFiles('assets'))
   .join('\n') + '\n';
}

module.exports = get;

if (!module.parent)
  console.log(get());
