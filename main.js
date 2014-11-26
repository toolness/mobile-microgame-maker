require([
  "jsx!app",
  "spreadsheet-to-spritesheet",
  "jquery"
], function(app, spreadsheetToSpritesheet, $) {
  function importGame(game, options) {
    var TIMEOUT = 5000;
    var deferred = $.Deferred();
    var timeout = null;

    function reject(reason) {
      clearTimeout(timeout);
      timeout = null;
      window.alert("Failed to import minigame: " + reason);
      deferred.reject();
      return deferred;
    }

    if (!game) {
      deferred.resolve();
    } else if (game == 'opener') {
      if (!window.opener) return reject("window.opener is null");

      timeout = window.setTimeout(function() {
        reject("nonexistent or invalid response from opener");
      }, TIMEOUT);
      window.addEventListener('message', function onMessage(event) {
        if (timeout === null) return;
        if (event.source !== window.opener) return;
        var message = JSON.parse(event.data);
        if (message.type == 'import' && message.gameData) {
          window.removeEventListener('message', onMessage, false);
          window.history.replaceState({}, '', window.location.pathname);
          if (window.confirm("Import minigame from " + event.origin + "?")) {
            options.defaultGameData = message.gameData;
          }
          clearTimeout(timeout);
          deferred.resolve();
        }
      }, false);
      window.opener.postMessage('mmm:ready', '*');
    } else {
      reject("unknown importGame value '" + game + "'");
    }

    return deferred;
  }

  function importSpreadsheet(spreadsheet, options) {
    var TIMEOUT = 5000;
    var deferred = $.Deferred();
    var timeout = null;

    if (spreadsheet && spreadsheet.match(/^[A-Za-z0-9]+$/)) {
      if (spreadsheet == 'on') {
        spreadsheet = '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs';
      }

      timeout = window.setTimeout(function() {
        timeout = null;
        window.alert('Failed to retrieve spreadsheet ' + spreadsheet);
        deferred.reject();
      }, TIMEOUT);
      spreadsheetToSpritesheet(spreadsheet, function(result) {
        if (timeout === null) return;
        clearTimeout(timeout);
        options.spriteLibrary = result;
        deferred.resolve();
      });
    } else {
      deferred.resolve();
    }

    return deferred;
  }

  function startApp(options) {
    $('html').removeClass('loading');

    var editor = app($.extend(options, {
      root: document.documentElement,
      editorHolder: document.getElementById('editor-holder'),
      modalHolder: document.getElementById('modal-holder'),
      blocklyHolder: document.getElementById('blockly-holder'),
      storage: window.sessionStorage,
      storageKey: 'mmm_gamedata'
    }));

    // For debugging via console only!
    window.editor = editor;
  }

  $(function() {
    var options = {};
    var qs = (function getQueryVariables(query) {
      var result = {};
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        result[pair[0]] = decodeURIComponent(pair[1]);
      }
      return result;
    })(window.location.search.substring(1));

    $.when(
      importSpreadsheet(qs.spreadsheet, options),
      importGame(qs.importGame, options)
    ).then(function() {
      startApp(options);
    });
  });
});
