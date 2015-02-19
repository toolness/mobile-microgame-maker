defineTests([
  "src/migrations",
], function(migrations) {
  module("migrations");

  test("0001-overlap-with-tolerance", function() {
    deepEqual(migrations.migrate({
      blocklyXml: [
        '<xml xmlns="http://www.w3.org/1999/xhtml">',
        '  <block type="phaser_sprites_overlap" id="456">',
        '    <field name="SPRITE1">a</field>',
        '    <field name="SPRITE2">b</field>',
        '  </block>',
        '</xml>'
      ].join('\n')
    }, {
      maxVersion: 1,
      prettifyXml: true
    }), {
      version: 1,
      blocklyXml: [
        '<xml xmlns="http://www.w3.org/1999/xhtml">',
        '  <block type="phaser_sprites_overlap_with_tolerance" id="456">',
        '    <field name="SPRITE1">a</field>',
        '    <field name="SPRITE2">b</field>',
        '    <field name="TOLERANCE">0</field>',
        '  </block>',
        '</xml>'
      ].join('\n')
    });
  });
});
