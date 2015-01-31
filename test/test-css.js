defineTests(["jquery"], function() {
  module("CSS");

  asyncTest("css/base.css contains no errors", function() {
    jQuery.get('../css/base.css?bust=' + Date.now(), function(text) {
      if (text.indexOf('ERROR') == -1) {
        ok(true, "output contains no errors");
      } else {
        ok(false, "output has errors: " + text);
      }
      ok(text.length > 1024, "output is > 1k");
      start();
    });
  });
});
