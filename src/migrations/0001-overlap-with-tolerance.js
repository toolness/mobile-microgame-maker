define(function(require) {
  var Blockly = require('blockly');
  var $ = require('jquery');

  function migrate(xml) {
    var dom = Blockly.Xml.textToDom(xml);
    $('block[type=phaser_sprites_overlap]', dom).each(function() {
      $(this).attr('type', 'phaser_sprites_overlap_with_tolerance');
      var field = document.createElement('field');
      $(field).attr('name', 'TOLERANCE').text('0');
      $(this).append(field);
    });
    return Blockly.Xml.domToText(dom);
  }

  return function migrateOverlapBlock(gameData) {
    gameData.blocklyXml = migrate(gameData.blocklyXml);
  };
});
