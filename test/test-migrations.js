defineTests([
  "src/phaser-blocks",
  "jquery"
], function(Blockly, $) {
  module("migrations");

  function migrate(xml) {
    xml = xml.split('\n').map(function(line) {
      return line.trim();
    }).join('');
    var dom = Blockly.Xml.textToDom(xml);
    $('block[type=phaser_sprites_overlap]', dom).each(function() {
      $(this).attr('type', 'phaser_sprites_overlap_with_tolerance');
      var field = document.createElement('field');
      $(field).attr('name', 'TOLERANCE').text('0');
      $(this).append(field);
    });
    return Blockly.Xml.domToPrettyText(dom);
  }

  test("upgrading phaser_sprites_overlap works", function() {
    var xml = [
      '<xml xmlns="http://www.w3.org/1999/xhtml">',
      '  <block type="phaser_sprites_overlap" id="456">',
      '    <field name="SPRITE1">a</field>',
      '    <field name="SPRITE2">b</field>',
      '  </block>',
      '</xml>'
    ].join('\n');
    equal(migrate(xml), [
      '<xml xmlns="http://www.w3.org/1999/xhtml">',
      '  <block type="phaser_sprites_overlap_with_tolerance" id="456">',
      '    <field name="SPRITE1">a</field>',
      '    <field name="SPRITE2">b</field>',
      '    <field name="TOLERANCE">0</field>',
      '  </block>',
      '</xml>'
    ].join('\n'));
  });
});
