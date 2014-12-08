define(function(require) {
  var _ = require('underscore');
  var Blockly = require('blockly');
  var hackBlocklyForIos = require('./ui/blockly-ios-hacks');
  var gameData = null;
  var soundsUsed = null;

  var EMPTY_LIST = [['--', '']];

  function soundList() {
    if (!(gameData && gameData.sounds.length))
      return EMPTY_LIST;
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
    return EMPTY_LIST;
  }

  function filteredSpriteList(filter) {
    return function() {
      if (!gameData) return EMPTY_LIST;
      return spriteList(gameData.sprites.filter(filter));
    };
  }

  function spriteList(list) {
    if (!gameData) return EMPTY_LIST;
    list = list || gameData.sprites;
    if (!list.length) return EMPTY_LIST;
    return list.map(function(sprite) {
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
    generateJs: function(newGameData) {
      Blockly.Phaser.setGameData(newGameData);
      soundsUsed = [];

      var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
      xml = Blockly.Xml.domToText(xml);

      var blocklyLines = Blockly.JavaScript.workspaceToCode().split('\n');
      var lines = [
        'function start(state) {',
        '  var game = state.game;',
        '  var microgame = state.microgame;',
        '  var sprites = state.sprites;',
        '  var sounds = state.sounds;',
        '  ',
      ];

      lines.push.apply(lines, blocklyLines.map(function(line) {
        return '  ' + line;
      }));
      lines.push('}');

      return {
        start: lines.join('\n'),
        soundsUsed: soundsUsed
      };
    }
  };

  Blockly.Blocks['phaser_add_event'] = {
    init: function() {
      this.appendDummyInput().appendField('after')
        .appendField(new Blockly.FieldTextInput(
          '1000',
          Blockly.FieldTextInput.numberValidator
        ), 'MS').appendField('ms');
      this.appendStatementInput('STACK');
    }
  };

  Blockly.JavaScript['phaser_add_event'] = function(block) {
    var branch = generateJsBranch(block);

    return 'game.time.events.add(' + this.getFieldValue('MS') +
           ', function() {\n' + branch + '});\n';
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

  Blockly.Blocks['phaser_set_main_text'] = {
    init: function() {
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.interpolateMsg("set main text to %1",
                          ['TEXT', null, Blockly.ALIGN_RIGHT],
                          Blockly.ALIGN_RIGHT);
    }
  };

  Blockly.JavaScript['phaser_set_main_text'] = function(block) {
    var text = Blockly.JavaScript.valueToCode(block, 'TEXT',
        Blockly.JavaScript.ORDER_NONE) || '\'\'';

    return 'microgame.mainText.setText(' + text + ');\n';
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
      Blockly.JavaScript.ORDER_ATOMIC);
    var y = Blockly.JavaScript.valueToCode(block, 'Y',
      Blockly.JavaScript.ORDER_ATOMIC);
    var ms = block.getFieldValue('MS');
    var values = [];

    if (x) values.push({name: 'x', value: x});
    if (y) values.push({name: 'y', value: y});

    if (!values.length) return '';

    if (ms == '0') {
      return values.map(function(info) {
        return sprite + '.' + info.name + ' = ' + info.value;
      }).join(';\n') + ';\n';
    } else {
      return 'game.add.tween(' + sprite + ').to({\n' +
      values.map(function(info) {
        return '  ' + info.name + ': ' + info.value
      }).join(',\n') +
      '\n}, ' + ms + ', null, true);\n';
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
    soundsUsed.push(block.getFieldValue('SOUND'));
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
      var spritesWithMultipleAnims = filteredSpriteList(function(sprite) {
        var animations = gameData.animations[sprite.key];
        return animations.length > 1;
      });
      var spriteDropdown = new Blockly.FieldDropdown(spritesWithMultipleAnims, function(id) {
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

  Blockly.Blocks['phaser_on_win_or_lose'] = {
    init: function() {
      this.appendDummyInput().appendField('when game is')
        .appendField(new Blockly.FieldDropdown([
          ['won', 'win'],
          ['lost', 'lose'],
          ['won or lost', 'ending']
        ]), 'EVENT');
      this.appendStatementInput('STACK');
    }
  };

  Blockly.JavaScript['phaser_on_win_or_lose'] = function(block) {
    var branch = generateJsBranch(block);

    return 'state.on("' + block.getFieldValue('EVENT') +
           '", function() {\n' + branch + '});\n';
  };

  hackBlocklyForIos();

  return Blockly;
});
