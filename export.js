var Export = {
  files: {},
  toHtml: function(gameData, options) {
    options = options || {};
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
      stateJs: stateJs
    });
  },
  _getFile: function(filename) {
    return $.get(filename, function(js) {
      Export.files[filename] = js;
    }, "text");
  }
};

AssetLoader.add($.when(
  $.get('export-template.html', function(html) {
    Export._templateString = html;
  }),
  Export._getFile('simple-event-emitter.js'),
  Export._getFile('phaser-microgame.js')
));
