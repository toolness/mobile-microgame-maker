define(function(require) {
  var _ = require('underscore');
  var Blockly = require('phaser-blocks');
  var React = require('react');
  var PhaserState = require('phaser-state');

  var Export = {
    _templateString: require('text!templates/export-template.html'),
    fromHtml: function(html) {
      var match = html.match(/^var gameData = (.+);$/m);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch (e) {}
      }
      return null;
    },
    toHtml: function(gameData, options) {
      options = options || {};
      var s3GameData = React.addons.update(gameData, {
        baseURL: {$set: '//s3.amazonaws.com/minicade-assets/'}
      });
      var stateJs = PhaserState.Generators.createState({
        gameData: s3GameData,
        start: Blockly.Phaser.generateJs(s3GameData),
        standalone: true
      });
      return _.template(this._templateString, {
        phaserVersion: PhaserState.Generators.PHASER_VERSION,
        encourageRemix: options.encourageRemix,
        gameData: gameData,
        creatorURL: window.location.href,
        stateJs: stateJs
      });
    }
  };

  return Export;
});
