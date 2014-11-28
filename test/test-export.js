defineTests([
  "src/export",
  "src/default-game-data"
], function(Export, defaultGameData) {
  module("Export");

  test("fromHtml() returns null on invalid data", function() {
    strictEqual(Export.fromHtml("lololol"), null);
  });

  test("fromHtml() returns object on valid data", function() {
    var html = "var gameData = " + JSON.stringify(defaultGameData) + ";";
    deepEqual(Export.fromHtml(html), defaultGameData);
  });
});
