define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var URLUtils = require('URLUtils');
  var Blockly = require('./phaser-blocks');
  var React = require('react');
  var GameData = require('./game-data');
  var PhaserState = require('./phaser-state');

  var DEFAULT_NETWORK_TIMEOUT = 10000;

  var Export = {
    _templateString: require('text!codegen-templates/export-template.html'),
    fromJson: function(baseURL, gameData, cb) {
      if (typeof(gameData) == 'string')
        // Looks like gameData is a URL pointing to a JSON blob.
        return Export.fromUrl(resolveURL(gameData, baseURL), cb);
      if (gameData && gameData.blocklyXml && gameData.blocklyXml[0] != '<') {
        // Looks like blocklyXml is a URL.
        return $.ajax({
          url: resolveURL(gameData.blocklyXml, baseURL),
          timeout: DEFAULT_NETWORK_TIMEOUT,
          dataType: 'text',
          error: function(jqXHR, textStatus, errorThrown) {
            cb(new Error(textStatus));
          },
          success: function(data, textStatus, jqXHR) {
            gameData.blocklyXml = data;
            cb(null, gameData);
          }
        });
      }
      window.setTimeout(function() { cb(null, gameData); }, 0);
    },
    fromUrl: function(url, timeoutMs, cb) {
      if (typeof(cb) == 'undefined') {
        cb = timeoutMs;
        timeoutMs = DEFAULT_NETWORK_TIMEOUT;
      }
      url = resolveURL(url, window.location.href);
      $.ajax({
        url: url,
        timeout: timeoutMs,
        dataType: 'text',
        error: function(jqXHR, textStatus, errorThrown) {
          cb(new Error(textStatus));
        },
        success: function(data, textStatus, jqXHR) {
          var type = jqXHR.getResponseHeader('content-type');
          if (/^text\/html/.test(type))
            return Export.fromHtml(url, data, cb);
          if (/^application\/json/.test(type) ||
              /^binary\/octet-stream/.test(type)) {
            try {
              data = JSON.parse(data);
            } catch (e) {
              return cb(e);
            }
            return Export.fromJson(url, data, cb);
          }
          return cb(new Error('unknown content type: ' + type));
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
          var baseURL = resolveURL(message.pathname || '/', event.origin);
          Export.fromJson(baseURL, message.gameData, function(err, gameData) {
            if (err) return cb(err);
            cb(null, gameData, event.origin);
          });
        }
      }, false);
      window.opener.postMessage('mmm:ready', '*');
    },
    _fromHtml: function(html) {
      var match = html.match(/^var gameData = (.+);$/m);
      var result = null;
      if (match) {
        try {
          result = JSON.parse(match[1]);
        } catch (e) {}
      }
      return result;
    },
    fromHtml: function(baseURL, html, cb) {
      if (typeof(cb) == 'undefined') {
        cb = html;
        html = baseURL;
        baseURL = null;
      }
      return Export.fromJson(baseURL, Export._fromHtml(html), cb);
    },
    toHtml: function(gameData, options) {
      var originalBaseURL = gameData.baseURL;
      var blocklyInfo;
      var stateJs;
      var gameDataForRemix;

      options = _.defaults(options || {}, {
        baseAssetURL: '//s3.amazonaws.com/minicade-assets/',
        baseCreatorURL: window.location.protocol + '//' +
                        window.location.host + window.location.pathname,
        scripts: [
          '//cdnjs.cloudflare.com/ajax/libs/phaser/' +
          PhaserState.Generators.PHASER_VERSION +
          '/phaser.min.js'
        ]
      });

      stateJs = options.stateJs;
      gameDataForRemix = options.gameDataForRemix;

      if (!stateJs) {
        gameData = React.addons.update(gameData, {
          baseURL: {$set: options.baseAssetURL}
        });
        blocklyInfo = Blockly.Phaser.generateJs(gameData);
        gameData = GameData.minimize(gameData, blocklyInfo.soundsUsed);
        stateJs = PhaserState.Generators.createState({
          minimizeGameData: false,
          gameData: gameData,
          blocklyInfo: blocklyInfo
        });
      }

      if (!gameDataForRemix)
        gameDataForRemix = React.addons.update(gameData, {
          baseURL: {$set: originalBaseURL}
        });

      return _.template(this._templateString, {
        baseAssetURL: options.baseAssetURL,
        scriptTags: options.scripts.map(function(src) {
          return '<script src="' + src + '"></script>';
        }),
        encourageRemix: options.encourageRemix,
        gameDataForRemix: gameDataForRemix,
        gameData: gameData,
        creatorURL: options.baseCreatorURL + '?importGame=opener',
        stateJs: stateJs
      });
    }
  };

  function resolveURL(url, base) {
    return new URLUtils(url, base || undefined).href;
  }

  return Export;
});
