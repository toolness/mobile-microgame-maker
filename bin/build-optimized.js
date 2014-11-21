var requirejs = require('requirejs');
var fs = require('fs');

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
config.stubModules = ['jsx'];
config.optimize = "none";
config.modules = [
  {
    name: "main",
    exclude: ["react", "JSXTransformer", "text"]
  }
];

console.log("Building...");

requirejs.optimize(config, function(buildResponse) {
  console.log('Done. Built files are in the "build" directory.');
  fs.unlinkSync('JSXTransformer.useStrictMunged.js');
}, function(err) {
  console.log("Error!");
  console.log(err);
});
