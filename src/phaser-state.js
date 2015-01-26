/* jshint evil: true */
define(function(require) {
  var _ = require('underscore');
  var GameData = require('./game-data');
  var includes = {
    SimpleEventEmitter: require('includes/simple-event-emitter'),
    PhaserMicrogame: require('includes/phaser-microgame')
  };
  var includeFiles = [
    require('text!includes/simple-event-emitter.js'),
    require('text!includes/phaser-microgame.js')
  ].join('\n');

  var template = require('text!codegen-templates/phaser-state-template.js');
  var PhaserState = {
    Generators: {
      _stateTemplate: template
    }
  };

  PhaserState.Generators.stringifyArgs = function() {
    return [].slice.call(arguments).map(function(arg) {
      return JSON.stringify(arg);
    }).join(', ');
  };

  PhaserState.Generators.preload = function(gameData) {
    var resolveURL = GameData.resolveURL.bind(GameData, gameData);

    return ['function preload(game) {'].concat(
      gameData.spritesheets.map(function(info) {
        return '  game.load.spritesheet(' + this.stringifyArgs(
                 info.key, resolveURL(info.url),
                 info.frameWidth, info.frameHeight
               ) + ');';
      }, this),
      gameData.sounds.map(function(info) {
        return '  game.load.audio(' + this.stringifyArgs(
                 info.key, resolveURL(info.url)
                ) + ');';
      }, this),
      ['}']
    ).join('\n');
  };

  PhaserState.Generators.createSounds = function(gameData) {
    return ['function createSounds(state) {'].concat(
      ['  var sounds = state.sounds = {};'],
      ['  var game = state.game;'],
      gameData.sounds.map(function(info) {
        return '  sounds.' + info.key + ' = game.add.audio(' +
          this.stringifyArgs(info.key) + ');';
      }, this),
      ['}']
    ).join('\n');
  };

  PhaserState.Generators.createSprites = function(gameData) {
    var hasRandomSpawns = _.some(_.pluck(gameData.sprites, 'spawnArea'));
    return _.flatten(['function createSprites(state) {'].concat(
      hasRandomSpawns ? [
        '  function placeRandomlyInArea(sprite, left, top, width, height) {',
        '    var rect = new Phaser.Rectangle(left, top, ',
        '                                    Math.max(width-sprite.width, 0), ',
        '                                    Math.max(height-sprite.height, 0));',
        '    sprite.x = rect.randomX;',
        '    sprite.y = rect.randomY;',
        '  }',
        ''
      ] : [],
      ['  var sprites = state.sprites = {};'],
      ['  var game = state.game;'],
      gameData.sprites.map(function(info) {
        var spriteName = '  sprites.' + info.name;
        var animations = gameData.animations[info.key];

        return [
          spriteName + ' = game.add.sprite(' +
          this.stringifyArgs(info.x, info.y, info.key) + ');'
        ].concat(
          info.draggable
          ? [spriteName + '.inputEnabled = true;',
             spriteName + '.input.enableDrag(true);']
          : []
        ).concat(
          info.spawnArea
          ? ['  placeRandomlyInArea(' + spriteName.trim() + ', ' +
             this.stringifyArgs(info.spawnArea.left,
                                info.spawnArea.top,
                                info.spawnArea.width,
                                info.spawnArea.height) + ');']
          : []
        ).concat(animations.map(function(animInfo) {
          return spriteName + '.animations.add(' + this.stringifyArgs(
            animInfo.name, animInfo.frames,
            animInfo.frameRate, animInfo.loop
          ) + ');';
        }, this)).concat([
          spriteName + '.animations.play(' +
          this.stringifyArgs(info.animation) + ');'
        ]);
      }, this),
      ['}']
    )).join('\n');
  };

  PhaserState.Generators.createState = function(options) {
    var blocklyInfo = options.blocklyInfo;
    var gameData = GameData.minimize(options.gameData,
                                     blocklyInfo.soundsUsed);

    return _.template(this._stateTemplate, {
      preload: this.preload(gameData),
      createSprites: this.createSprites(gameData),
      createSounds: this.createSounds(gameData),
      expectedPhaserVersion: this.PHASER_VERSION,
      gameData: gameData,
      playTime: options.playTime || this.DEFAULT_PLAY_TIME,
      endingTime: options.endingTime || this.DEFAULT_ENDING_TIME,
      extra: options.standalone ? includeFiles : '',
      phaserIsUndefined: !!options.phaserIsUndefined,
      start: blocklyInfo.start
    });
  };

  PhaserState.Generators.makeFunc = function(name, gameData, Phaser) {
    return eval('(' + this[name](gameData) + ')');
  };

  PhaserState.Generators.DEFAULT_PLAY_TIME = 5000;
  PhaserState.Generators.DEFAULT_ENDING_TIME = 2000;
  PhaserState.Generators.PHASER_VERSION = "2.2.1";

  // Useful when creating a Phaser state that just serves as a
  // reference point to position things on, etc.
  PhaserState.Generators.makeInertStateObject = function(gameData) {
    return {
      preload: function() {
        PhaserState.Generators
          .makeFunc('preload', gameData, this.Phaser)(this.game);
      },
      create: function() {
        PhaserState.Generators
          .makeFunc('createSprites', gameData, this.Phaser)(this);
        this.game.stage.backgroundColor = gameData.backgroundColor;
        this.game.paused = true;
      }
    };
  };

  PhaserState.Generators.makeStateObject = function(options) {
    var stateJs = this.createState({
      gameData: options.gameData,
      blocklyInfo: options.blocklyInfo,
      playTime: options.playTime,
      endingTime: options.endingTime,
      phaserIsUndefined: true
    });
    stateJs = [
      '//# sourceURL=generated-phaser-state-code.js',
      '(function(SimpleEventEmitter, PhaserMicrogame) {',
      'var Phaser;',
      stateJs,
      'return state;',
      '});'
    ].join('\n');

    //console.log("stateJs is", stateJs);
    var state = eval(stateJs)(includes.SimpleEventEmitter,
                              includes.PhaserMicrogame);

    _.extend(state, {
      setPaused: function(isPaused) {
        this.game.paused = isPaused;
      },
      isEnded: function() {
        return this.microgame.isEnded();
      }
    });

    state.on('create', function() {
      if (!options.autoplay)
        state.game.paused = true;
    });

    if (options.onGameEnded)
      state.on('end', options.onGameEnded.bind(null, state));

    return state;
  };

  PhaserState.getSprite = function(gameData, item, phaserState) {
    if (!phaserState.sprites) return;
    var spriteNames = Object.keys(phaserState.sprites);
    var foundName;
    spriteNames.some(function(name) {
      if (phaserState.sprites[name] === item) {
        foundName = name;
        return true;
      }
    });
    if (foundName)
      return GameData.spriteWithName(gameData, foundName);
  };

  return PhaserState;
});
