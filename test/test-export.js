defineTests([
  "src/export",
  "./sample-game-data"
], function(Export, defaultGameData) {
  module("Export");

  test("_fromHtml() returns null on invalid data", function() {
    strictEqual(Export._fromHtml("lololol"), null);
  });

  test("_fromHtml() returns object on valid data", function() {
    var html = "var gameData = " + JSON.stringify(defaultGameData) + ";";
    deepEqual(Export._fromHtml(html), defaultGameData);
  });

  asyncTest("fromUrl() works with examples/simple.html", function() {
    Export.fromUrl('../examples/simple.html', function(err, gameData) {
      strictEqual(err, null);
      strictEqual(gameData.blocklyXml.slice(0, 4), '<xml');
      strictEqual(gameData.name, 'simple');
      start();
    });
  });
});
