define(function(require) {
  var React = require('react');
  var PhaserState = require('phaser-state');

  var Export = {
    _templateString: require('text!export-template.html'),
    files: {
      'simple-event-emitter.js': require('text!simple-event-emitter.js'),
      'phaser-microgame.js': require('text!phaser-microgame.js')
    },
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
      gameData = React.addons.update(gameData, {
        baseURL: {$set: '//s3.amazonaws.com/minicade-assets/'}
      });
      var stateJs = PhaserState.Generators.createState({
        gameData: gameData,
        start: Blockly.Phaser.generateJs(gameData),
        extra: [
          this.files['simple-event-emitter.js'],
          this.files['phaser-microgame.js']
        ].join('\n')
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