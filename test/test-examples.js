defineTests([
  "examples/examples",
  "src/export",
  "src/game-data",
  "src/default-game-data"
], function(EXAMPLES, Export, GameData, defaultGameData) {
  module("examples");

  function quote(str) {
    return '"' + str + '"'
  }

  EXAMPLES.forEach(function(name) {
    var qname = quote(name);

    asyncTest(qname + " uses unaltered assets", function() {
      var url = '../examples/' + name + '.json';
      Export.fromUrl(url, function(err, gameData) {
        if (err) throw err;

        gameData.sounds.forEach(function(sound) {
          var libSound = _.findWhere(defaultGameData.sounds, {
            key: sound.key
          });
          deepEqual(sound, libSound,
                    "sound " + quote(sound.key) + " is unaltered");
        });

        gameData.spritesheets.forEach(function(sheet) {
          var libSheet = _.findWhere(defaultGameData.spritesheets, {
            key: sheet.key
          });
          deepEqual(sheet, libSheet,
                    "spritesheet " + quote(sheet.key) + " is unaltered");
        });

        _.keys(gameData.animations).forEach(function(animName) {
          var anim = gameData.animations[animName];
          var libAnim = defaultGameData.animations[animName];
          deepEqual(anim, libAnim,
                    "animations for " + quote(animName) + " are unaltered");
        });

        start();
      });
    });
  });
});
