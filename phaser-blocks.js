(function() {
  var gameData = null;

  function soundList() {
    if (!(gameData && gameData.sounds.length))
      return [['--', '']];
    return gameData.sounds.map(function(sound) {
      return [sound.key, sound.key];
    });    
  }

  function spriteList() {
    if (!(gameData && gameData.sprites.length))
      return [['--', '']];
    return gameData.sprites.map(function(sprite) {
      return [sprite.name, sprite.id];
    });
  }

  function spriteName(id) {
    // TODO: Deal w/ case where id is invalid.
    return _.findWhere(gameData.sprites, {id: id}).name;
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

      return '//# sourceURL=generated-blockly-code.js\n' +
             Blockly.JavaScript.workspaceToCode();
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
    var sprite = 'sprites.' + spriteName(block.getFieldValue('SPRITE'));
    var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.STATEMENT_PREFIX) {
      branch = Blockly.JavaScript.prefixLines(
          Blockly.JavaScript.STATEMENT_PREFIX.replace(/%1/g,
          '\'' + block.id + '\''), Blockly.JavaScript.INDENT) + branch;
    }
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
          '\'' + block.id + '\'') + branch;
    }

    return sprite + '.inputEnabled = true;\n' +
           sprite + '.events.onInputDown.add(function() {\n' + branch + '});\n';
  };

  Blockly.Blocks['phaser_play_sound'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendDummyInput().appendField('play')
        .appendField(new Blockly.FieldDropdown(soundList), 'SOUND');
    }
  };

  Blockly.JavaScript['phaser_play_sound'] = function(block) {
    return 'sounds.' + block.getFieldValue('SOUND') + '.play();\n';
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

    return 'game.stage.backgroundColor = ' + colour + ';\n';
  };
})();
