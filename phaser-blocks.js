(function() {
  var gameData = null;

  function spriteList() {
    if (!(gameData && gameData.sprites.length))
      return [['--', '']];
    return gameData.sprites.map(function(sprite) {
      return [sprite.name, sprite.id];
    });
  }

  Blockly.Phaser = {
    setGameData: function(newGameData) {
      gameData = newGameData;

      Blockly.mainWorkspace.clear();
      var xml = Blockly.Xml.textToDom(gameData.blocklyXml);
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    },
    generateJs: function() {
      var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      xml = Blockly.Xml.domToText(xml);

      return Blockly.JavaScript.workspaceToCode();
    }
  };

  Blockly.Blocks['phaser_on_tap'] = {
    init: function() {
      this.appendDummyInput().appendField('when')
        .appendField(new Blockly.FieldDropdown(spriteList), 'SPRITE');
      this.appendStatementInput('STACK').appendField('is tapped');
    }
  };

  Blockly.JavaScript['phaser_on_tap'] = function(block) {
    return 'console.log("TODO: ontap for ", ' +
      JSON.stringify(block.getFieldValue('SPRITE')) + ');';
  };

  Blockly.Blocks['phaser_set_bg'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendValueInput('COLOUR').setCheck('Colour')
        .appendField('set background to');
    }
  };

  Blockly.JavaScript['phaser_set_bg'] = function(block) {
    var colour = Blockly.JavaScript.valueToCode(block, 'COLOUR',
      Blockly.JavaScript.ORDER_COMMA) || '\'#FFFFFF\'';

    return 'game.stage.backgroundColor = ' + colour + ';';
  };
})();
