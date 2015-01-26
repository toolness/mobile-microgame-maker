defineTests([
  "underscore",
  "react",
  "src/game-data",
  "./sample-game-data"
], function(_, React, GameData, defaultGameData) {
  module("GameData");

  function gd(data) {
    return _.extend({
      sounds: [],
      spritesheets: [],
      animations: {}
    }, data || {});
  }

  test("maximize() adds assets", function() {
    var gameData = GameData.maximize(gd(), defaultGameData);
    deepEqual(gameData.sounds, defaultGameData.sounds);
    deepEqual(gameData.spritesheets, defaultGameData.spritesheets);
    deepEqual(gameData.animations, defaultGameData.animations);
  });

  test("maximize() merges sounds properly", function() {
    var gameData = GameData.maximize(gd({
      sounds: [
        {key: "test_maximize", url: "sounds/test.mp3"},
        {key: "woosh", url: "http://example.org/mywoosh"}
      ]
    }), defaultGameData);
    ok(_.findWhere(gameData.sounds, {key: "blop"}),
       "sounds from assetLibrary are included");
    ok(_.findWhere(gameData.sounds, {key: "test_maximize"}),
       "original sounds are included");
    equal(_.countBy(gameData.sounds, function(sound) {
      if (sound.key == 'woosh') return 'woosh';
    }).woosh, 1, "conflicting sounds are not duplicated");
    ok(_.findWhere(gameData.sounds, {
         key: "woosh",
         url: "http://example.org/mywoosh"
       }),
       "original sounds override ones from assetLibrary");
  });

  test("maximize() merges spritesheets properly", function() {
    var gameData = GameData.maximize(gd({
      spritesheets: [
        {key: "test_maximize", url: "img/test.png"},
        {key: "fly", url: "http://example.org/myfly"}
      ],
      animations: {
        test_maximize: [{name: "maximize_anim"}],
        fly: [{name: "myflying"}]
      }
    }), defaultGameData);

    ok(_.findWhere(gameData.spritesheets, {key: "test_maximize"}),
       "original spritesheets are included");
    ok('test_maximize' in gameData.animations,
       "original animations are included");

    ok(_.findWhere(gameData.spritesheets, {key: "grumpaloomba"}),
       "spritesheets from assetLibrary are included");
    ok('grumpaloomba' in gameData.animations,
       "animations from assetLibrary are included");

    equal(_.countBy(gameData.spritesheets, function(spritesheet) {
      if (spritesheet.key == 'fly') return 'fly';
    }).fly, 1, "conflicting spritesheets are not duplicated");
    ok(_.findWhere(gameData.spritesheets, {
         key: "fly",
         url: "http://example.org/myfly"
       }),
       "original spritesheets override ones from assetLibrary");
    deepEqual(gameData.animations.fly, [{name: "myflying"}],
              "original animations override ones from assetLibrary");
  });

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
