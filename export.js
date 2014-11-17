var Export = {
  files: {},
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
