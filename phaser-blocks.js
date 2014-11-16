(function() {
  var gameData = null;

  function soundList() {
    if (!(gameData && gameData.sounds.length))
      return [['--', '']];
    return gameData.sounds.map(function(sound) {
      return [sound.key, sound.key];
    });    
  }

  function generateJsBranch(block) {
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

    return branch;
  }

  function animationList(spriteDropdown) {
    var spriteId = typeof(spriteDropdown) == 'string'
                   ? spriteDropdown : spriteDropdown.getValue();

    var sprite = spriteWithId(spriteId);
    if (sprite) {
      var animations = gameData.animations[sprite.key];
      if (animations && animations.length) {
        return animations.map(function(animation) {
          return [animation.name, animation.name];
        });
      }
    }
    return [['--', '']];
  }

  function spriteList() {
    if (!(gameData && gameData.sprites.length))
      return [['--', '']];
    return gameData.sprites.map(function(sprite) {
      return [sprite.name, sprite.id];
    });
  }

  function spriteWithId(id) {
    // TODO: Deal w/ case where id is invalid.
    return _.findWhere(gameData.sprites, {id: id});
  }

  function spriteName(id) {
    return spriteWithId(id).name;
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

  Blockly.Blocks['phaser_repeat_event'] = {
    init: function() {
      this.appendDummyInput().appendField('every')
        .appendField(new Blockly.FieldTextInput(
          '1000',
          Blockly.FieldTextInput.numberValidator
        ), 'MS').appendField('ms');
      this.appendStatementInput('STACK');
    }
  };

  Blockly.JavaScript['phaser_repeat_event'] = function(block) {
    var branch = generateJsBranch(block);

    return 'game.time.events.loop(' + this.getFieldValue('MS') +
           ', function() {\n' + branch + '});\n';
  };

  Blockly.Blocks['phaser_on_update'] = {
    init: function() {
      this.appendDummyInput().appendField('when game updates')
      this.appendStatementInput('STACK');
    }
  };

  Blockly.JavaScript['phaser_on_update'] = function(block) {
    var branch = generateJsBranch(block);

    return 'state.on("update", function() {\n' + branch + '});\n';
  };

  Blockly.Blocks['phaser_on_outoftime'] = {
    init: function() {
      this.appendDummyInput().appendField('when time limit expires')
      this.appendStatementInput('STACK');
    }
  };

  Blockly.JavaScript['phaser_on_outoftime'] = function(block) {
    var branch = generateJsBranch(block);

    return 'state.on("outoftime", function() {\n' + branch + '});\n';
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
    var branch = generateJsBranch(block);

    return sprite + '.inputEnabled = true;\n' +
           sprite + '.events.onInputDown.add(function() {\n' + branch + '});\n';
  };

  Blockly.Blocks['phaser_move'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendDummyInput().appendField('move')
        .appendField(new Blockly.FieldDropdown(spriteList), 'SPRITE');
      this.appendValueInput('X').setCheck('Number').appendField('to x');
      this.appendValueInput('Y').setCheck('Number').appendField('and y');
      this.appendDummyInput().appendField('over')
        .appendField(new Blockly.FieldTextInput(
          '1000',
          Blockly.FieldTextInput.numberValidator
        ), 'MS').appendField('ms');
    }
  };

  Blockly.JavaScript['phaser_move'] = function(block) {
    var sprite = 'sprites.' + spriteName(block.getFieldValue('SPRITE'));    
    var x = Blockly.JavaScript.valueToCode(block, 'X',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var y = Blockly.JavaScript.valueToCode(block, 'Y',
      Blockly.JavaScript.ORDER_ATOMIC) || '0';
    var ms = block.getFieldValue('MS');

    if (ms == '0') {
      return sprite + '.x = ' + x + '; ' + sprite + '.y = ' + y + ';\n';
    } else {
      return 'game.add.tween(' + sprite + ').to({' +
             'x: ' + x + ', y: ' + y + '}, ' + ms + ', null, true);\n';
    }
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

  Blockly.Blocks['phaser_win'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendDummyInput().appendField('win');
    }
  };

  Blockly.JavaScript['phaser_win'] = function(block) {
    return 'microgame.win();\n';
  };

  Blockly.Blocks['phaser_lose'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.appendDummyInput().appendField('lose');
    }
  };

  Blockly.JavaScript['phaser_lose'] = function(block) {
    return 'microgame.lose();\n';
  };

  Blockly.Blocks['phaser_set_animation'] = {
    init: function() {
      var spriteDropdown = new Blockly.FieldDropdown(spriteList, function(id) {
        var animations = animationList(id);
        var currAnimation = _.findWhere(animations, {
          1: animationDropdown.getValue()
        });
        if (!currAnimation)
          animationDropdown.setValue(animations[0][1]);
      });
      var animationDropdown = new Blockly.FieldDropdown(
        animationList.bind(null, spriteDropdown)
      );

      this.setPreviousStatement(true);
      this.setNextStatement(true);
  
      this.appendDummyInput().appendField('set animation of')
        .appendField(spriteDropdown, 'SPRITE');
      this.appendDummyInput().appendField('to')
        .appendField(animationDropdown, 'ANIMATION');
    }
  };

  Blockly.JavaScript['phaser_set_animation'] = function(block) {
    var sprite = 'sprites.' + spriteName(block.getFieldValue('SPRITE'));
    var animation = block.getFieldValue('ANIMATION');

    return sprite + '.animations.play("' + animation + '");\n';
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
