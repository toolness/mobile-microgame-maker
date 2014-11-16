var Export = {
  toHtml: function(gameData, cb) {
    var templateString;
    var templateContext = {
      phaserVersion: PhaserState.PHASER_VERSION,
      gameData: gameData,
      blocklyJs: Blockly.Phaser.generateJs(gameData)
    };

    $.when(
      $.get('export-template.html', function(html) {
        templateString = html;
      }),
      $.get('phaser-state.js', function(js) {
        templateContext.phaserStateJs = js;
      })
    ).then(function() {
      cb(null, _.template(templateString, templateContext));
    });
  }
};
