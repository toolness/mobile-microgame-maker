var requirejs = require('requirejs');
var execFile = require('child_process').execFile;
var fs = require('fs');

var buildCss = require('./build-css');
var getCacheManifest = require('./get-cache-manifest');

var ENABLE_APPCACHE = 'ENABLE_APPCACHE' in process.env;

function loadFileWithHtmlAttrs(filename, attrs) {
  var attrPairs = [];
  Object.keys(attrs).forEach(function(name) {
    var value = attrs[name];

    if (typeof(attrs[name]) == 'undefined') return;
    attrPairs.push(name + '="' + value + '"');
  });
  return fs.readFileSync(filename, 'utf-8').replace(
    'data-maybe-replace-me-with-a-manifest',
    attrPairs.join(' ')
  );
}

function buildWithGitCommit(gitCommit, cb) {
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
      ['index.html', 'phaser-frame.html'].forEach(function(filename) {
        fs.writeFileSync(
          'build/' + filename,
          loadFileWithHtmlAttrs(filename, {
            'manifest': ENABLE_APPCACHE ? 'mmm.appcache' : undefined,
            'data-git-commit': gitCommit,
            'data-build-date': buildDate.toISOString()
          })
        );
      });
      console.log('Built version ' + buildDate.toISOString() +
                  ', based on commit ' +
                  (gitCommit || '?').slice(0, 10) + '.');
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

function build(cb) {
  execFile('git', ['rev-parse', 'HEAD'], function(err, hash) {
    if (err || !/^[a-f0-9]+$/.test(hash.trim())) {
      console.log("warning: 'git rev-parse HEAD' failed.");
      hash = undefined;
    } else {
      hash = hash.trim();
    }
    buildWithGitCommit(hash, cb);
  });
}

module.exports = build;
module.exports.loadFileWithHtmlAttrs = loadFileWithHtmlAttrs;

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
