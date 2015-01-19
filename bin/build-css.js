var fs = require('fs');
var less = require('less');

var OUTPUT_FILENAME = 'css/base.css';

function buildCss(cb) {
  var parser = new less.Parser({
    paths: [__dirname + '/../css']
  });

  parser.parse('@import "base.less";', function(err, tree) {
    var css;

    if (err) return cb(err);

    try {
      css = tree.toCSS();
    } catch (e) {
      return cb(e);
    }
    fs.writeFileSync(__dirname + '/../' + OUTPUT_FILENAME, css);
    cb(null);
  });
}

module.exports = buildCss;
module.exports.OUTPUT_FILENAME = OUTPUT_FILENAME;

if (!module.parent)
  buildCss(function(err) {
    if (err) throw err;
    console.log("Built CSS.");
  });
