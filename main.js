require([
  "jsx!src/ui/app",
  "src/spreadsheet-to-assets",
  "src/export",
  "jquery"
], function(app, spreadsheetToAssets, Export, $) {
  function importGame(game, options) {
    var TIMEOUT = 5000;
    var deferred = $.Deferred();

    function reject(reason) {
      window.alert("Failed to import minigame: " + reason);
      deferred.reject();
    }

    function accept(gameData, from) {
      window.history.replaceState({}, '', window.location.pathname);
      if (window.confirm("Import minigame from " + from + "?")) {
        options.importedGameData = gameData;
      }
      deferred.resolve();
    }

    if (!game) {
      deferred.resolve();
    } else if (game == 'opener') {
      Export.fromWindowOpener(TIMEOUT, function(err, gameData, origin) {
        if (err) return reject(err.message);
        accept(gameData, origin);
      });
    } else if (/^https?:\/\//.test(game)) {
      Export.fromUrl(game, TIMEOUT, function(err, gameData) {
        if (err) return reject(err.message);
        accept(gameData, game);
      });
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
        spreadsheet = null;
      }

      timeout = window.setTimeout(function() {
        timeout = null;
        window.alert('Failed to retrieve spreadsheet ' + spreadsheet);
        deferred.reject();
      }, TIMEOUT);
      spreadsheetToAssets(spreadsheet, function(result) {
        if (timeout === null) return;
        window.clearTimeout(timeout);
        options.assetLibrary = result;
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
