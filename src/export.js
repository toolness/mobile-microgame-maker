define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Blockly = require('./phaser-blocks');
  var React = require('react');
  var PhaserState = require('./phaser-state');
  var importFromHtml = require('./import-from-html');

  var Export = {
    _templateString: require('text!templates/export-template.html'),
    fromUrl: function(url, timeoutMs, cb) {
      $.ajax({
        url: url,
        timeout: timeoutMs,
        dataType: 'text',
        error: function(jqXHR, textStatus, errorThrown) {
          cb(new Error(textStatus));
        },
        success: function(data, textStatus, jqXHR) {
          var gameData = Export.fromHtml(data);
          if (gameData)
            cb(null, gameData);
          else
            cb(new Error("gameData not found"));
        }
      });
    },
    fromWindowOpener: function(timeoutMs, cb) {
      var timeout = null;

      function reject(reason) {
        window.clearTimeout(timeout);
        timeout = null;
        cb(new Error(reason));
      }

      if (!window.opener)
        return window.setTimeout(function() {
          reject("window.opener is null");
        }, 1);

      timeout = window.setTimeout(function() {
        reject("nonexistent or invalid response from opener");
      }, timeoutMs);
      window.addEventListener('message', function onMessage(event) {
        if (timeout === null) return;
        if (event.source !== window.opener) return;
        var message = JSON.parse(event.data);
        if (message.type == 'import' && message.gameData) {
          window.removeEventListener('message', onMessage, false);
          window.clearTimeout(timeout);
          cb(null, message.gameData, event.origin);
        }
      }, false);
      window.opener.postMessage('mmm:ready', '*');
    },
    fromHtml: importFromHtml,
    toHtml: function(gameData, options) {
      options = options || {};
      var s3GameData = React.addons.update(gameData, {
        baseURL: {$set: options.baseAssetURL ||
                        '//s3.amazonaws.com/minicade-assets/'}
      });
      var blocklyInfo = Blockly.Phaser.generateJs(s3GameData);
      var stateJs = PhaserState.Generators.createState({
        gameData: s3GameData,
        blocklyInfo: blocklyInfo,
        standalone: true
      });
      var phaserURL = options.phaserURL ||
                      ('//cdnjs.cloudflare.com/ajax/libs/phaser/' +
                       PhaserState.Generators.PHASER_VERSION +
                       '/phaser.min.js');
      var tinygameURL = options.tinygameURL ||
                        '//toolness.github.io/fancy-friday/contrib/' +
                        'tinygame.js';
      return _.template(this._templateString, {
        baseAssetURL: s3GameData.baseURL,
        phaserURL: phaserURL,
        tinygameURL: tinygameURL,
        encourageRemix: options.encourageRemix,
        gameData: gameData,
        creatorURL: window.location.protocol + '//' +
          window.location.host + window.location.pathname +
          '?importGame=opener',
        stateJs: stateJs
      });
    }
  };

  return Export;
});
