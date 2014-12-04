defineTests([
  "react",
  "src/game-data",
  "./sample-game-data"
], function(React, GameData, defaultGameData) {
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

  test("withoutUnusedSpritesheets() clears when none used", function() {
    var gameData = GameData.withoutUnusedSpritesheets(defaultGameData);
    deepEqual(gameData.spritesheets, []);
    deepEqual(gameData.animations, {});
  });

  test("withoutUnusedSpritesheets() omits unused", function() {
    var gameData = React.addons.update(defaultGameData, {
      sprites: {
        $set: [{key: 'fly'}]
      }
    });

    gameData = GameData.withoutUnusedSpritesheets(gameData);
    equal(gameData.spritesheets.length, 1);
    equal(gameData.spritesheets[0].key, 'fly');
    equal(Object.keys(gameData.animations).length, 1);
    ok(gameData.animations['fly']);
  });
});
