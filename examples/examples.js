(function(global) {
  var EXAMPLES = [
    'simple'
  ];

  if (typeof(global.define) == 'function') {
    global.define(function() { return EXAMPLES; });
  } else {
    global.EXAMPLES = EXAMPLES;
  }
})(window);
