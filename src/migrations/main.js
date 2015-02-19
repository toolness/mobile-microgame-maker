define(function(require) {
  var _ = require('underscore');

  var migrations = [
    require('./0001-overlap-with-tolerance')
  ];

  function migrate(gameData, options) {
    options = _.defaults(options || {}, {
      maxVersion: Infinity
    });

    if (typeof(gameData.version) == 'undefined')
      gameData.version = 0;

    while (gameData.version < options.maxVersion &&
           gameData.version < migrations.length) {
      migrations[gameData.version](gameData);
      gameData.version++;
    }

    return gameData;
  }

  return {
    migrate: migrate
  };
});
