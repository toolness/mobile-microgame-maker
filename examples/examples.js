(function(global) {
  var EXAMPLES = [
    'simple',
    'falling-star'
  ];

  if (typeof(global.define) == 'function') {
    global.define(function() { return EXAMPLES; });
  } else {
    global.EXAMPLES = EXAMPLES;
  }
})(window);
