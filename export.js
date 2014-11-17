var Export = {
  toHtml: function(gameData) {
    return _.template(this._templateString, {
      phaserVersion: PhaserState.PHASER_VERSION,
      gameData: gameData,
      phaserStateJs: this._phaserStateJs,
      blocklyJs: Blockly.Phaser.generateJs(gameData)
    });
  }
};

AssetLoader.add($.when(
  $.get('export-template.html', function(html) {
    Export._templateString = html;
  }),
  $.get('phaser-state.js', function(js) {
    Export._phaserStateJs = js;
  })
));
