(function(global) {
  var EXAMPLES = [
    'simple',
    'falling-star',
    'steal-the-sushi',
    'dancing-bear',
    'marshmallow',
    'swat-flies',
    'poop',
    'close-your-eyes',
    'press-all-buttons',
    'count-sheep',
    'break-the-ice'
  ];

  if (typeof(global.define) == 'function') {
    global.define(function() { return EXAMPLES; });
  } else {
    global.EXAMPLES = EXAMPLES;
  }
})(window);
