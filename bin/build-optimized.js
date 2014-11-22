var requirejs = require('requirejs');
var fs = require('fs');

var getCacheManifest = require('./get-cache-manifest');

function build(cb) {
  cb = cb || function() {};

  // We need to replace JSXTransformer w/ a munged version that doesn't
  // contain any occurrences of "use strict":
  //
  // https://github.com/seiffert/require-jsx/issues/1#issuecomment-31270188
  //
  // SO. WEIRD.

  var jsxt = fs.readFileSync('vendor/react/build/JSXTransformer.js', 'utf-8');

  jsxt = jsxt.replace(/'use strict'/g, "'use ' + 'strict'");

  fs.writeFileSync('JSXTransformer.useStrictMunged.js', jsxt);

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
      fs.writeFileSync('build/mmm.appcache', getCacheManifest());
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

if (!module.parent)
  build();
