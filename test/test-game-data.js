defineTests([
  "src/game-data",
  "src/default-game-data"
], function(GameData, defaultGameData) {
  module("GameData");

  test("withoutUnusedSounds() clears sounds when none used", function() {
    var gameData = GameData.withoutUnusedSounds(defaultGameData, []);
    deepEqual(gameData.sounds, []);
  });

  test("withoutUnusedSounds() omits unused sounds", function() {
    var gameData = GameData.withoutUnusedSounds(defaultGameData, ['blop']);
    equal(gameData.sounds.length, 1);
    equal(gameData.sounds[0].key, 'blop');
  });
});
