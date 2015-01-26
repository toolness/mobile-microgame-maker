var requirejs = require('requirejs');
var fs = require('fs');

var buildCss = require('./build-css');
var getCacheManifest = require('./get-cache-manifest');

var ENABLE_APPCACHE = 'ENABLE_APPCACHE' in process.env;

function loadIndexWithHtmlAttrs(attrs) {
  var attrPairs = [];
  Object.keys(attrs).forEach(function(name) {
    var value = attrs[name];

    if (typeof(attrs[name]) == 'undefined') return;
    attrPairs.push(name + '="' + value + '"');
  });
  return fs.readFileSync('index.html', 'utf-8').replace(
    'data-maybe-replace-me-with-a-manifest',
    attrPairs.join(' ')
  );
}

function build(cb) {
  cb = cb || function() {};

  var buildDate = new Date();

  // We need to replace JSXTransformer w/ a munged version that doesn't
  // contain any occurrences of "use strict":
  //
  // https://github.com/seiffert/require-jsx/issues/1#issuecomment-31270188
  //
  // SO. WEIRD.

  var jsxt = fs.readFileSync('vendor/react/build/JSXTransformer.js', 'utf-8');

  var jsxtMunged = jsxt.replace(/'use strict'/g, "'use ' + 'strict'");

  fs.writeFileSync('JSXTransformer.useStrictMunged.js', jsxtMunged);

  var config = require('../require-config');

  config.paths['JSXTransformer'] = 'JSXTransformer.useStrictMunged';

  config.dir = "./build";
  config.baseUrl = "./";
  config.fileExclusionRegExp = /(^\.)|(^(node_modules|bin)$)/;
  config.stubModules = ['jsx'];
  config.optimize = "none";
  config.modules = [
    {
      name: "main",
      exclude: ["JSXTransformer", "text"]
    }
  ];

  console.log("Building...");

  requirejs.optimize(config, function(buildResponse) {
    // For some reason requirejs swallows any exceptions that arise
    // here, so we'll do a process.nextTick() so that node logs any
    // thrown exceptions.
    process.nextTick(function() {
      fs.writeFileSync('build/mmm.appcache',
                       getCacheManifest(buildDate, !ENABLE_APPCACHE));
      fs.writeFileSync(
        'build/index.html',
        loadIndexWithHtmlAttrs({
          'manifest': ENABLE_APPCACHE ? 'mmm.appcache' : undefined,
          'data-build-date': buildDate.toISOString()
        })
      );
      console.log('Built version ' + buildDate.toISOString() + '.');
      fs.writeFileSync(
        'build/vendor/react/build/JSXTransformer.js',
        jsxt
      );
      console.log('Done. Built files are in the "build" directory.');
      fs.unlinkSync('JSXTransformer.useStrictMunged.js');
      cb(null);
    });
  }, function(err) {
    // Thanks Obama
    process.nextTick(function() {
      console.log("Error!");
      console.log(err);
      cb(err);
    });
  });
}

module.exports = build;
module.exports.loadIndexWithHtmlAttrs = loadIndexWithHtmlAttrs;

if (!module.parent) {
  console.log(
    "Building w/ appcache " +
    (ENABLE_APPCACHE ? "enabled. Unset " : "disabled. Set ") +
    "ENABLE_APPCACHE in env to change this."
  );
  buildCss(function(err) {
    if (err) throw err;
    console.log("Built CSS.");
    build();
  });
}
