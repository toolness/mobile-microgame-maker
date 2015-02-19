define(function(require) {
  var _ = require('underscore');
  var Blockly = require('blockly');

  var migrations = [
    require('./0001-overlap-with-tolerance')
  ];

  function unprettifyXml(xml) {
    return xml.split('\n').map(function(line) {
      return line.trim();
    }).join('');
  }

  function prettifyXml(xml) {
    return Blockly.Xml.domToPrettyText(Blockly.Xml.textToDom(xml));
  }

  function migrate(gameData, options) {
    options = _.defaults(options || {}, {
      maxVersion: Infinity,
      prettifyXml: false
    });

    if (typeof(gameData.version) == 'undefined')
      gameData.version = 0;

    if (options.prettifyXml)
      gameData.blocklyXml = unprettifyXml(gameData.blocklyXml);

    while (gameData.version < options.maxVersion &&
           gameData.version < migrations.length) {
      migrations[gameData.version](gameData);
      gameData.version++;
    }

    if (options.prettifyXml)
      gameData.blocklyXml = prettifyXml(gameData.blocklyXml);

    return gameData;
  }

  return {
    migrate: migrate
  };
});
