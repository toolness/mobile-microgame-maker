require([
  "jsx!app",
  "spreadsheet-to-spritesheet",
  "jquery"
], function(app, spreadsheetToSpritesheet, $) {
  var qs = (function getQueryVariables(query) {
    var result = {};
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      result[pair[0]] = decodeURIComponent(pair[1]);
    }
    return result;
  })(window.location.search.substring(1));

  function startApp(spriteLibrary) {
    $('html').removeClass('loading');

    var editor = app({
      root: document.documentElement,
      editorHolder: document.getElementById('editor-holder'),
      modalHolder: document.getElementById('modal-holder'),
      blocklyHolder: document.getElementById('blockly-holder'),
      spriteLibrary: spriteLibrary
    });

    // For debugging via console only!
    window.editor = editor;
  }

  $(function() {
    var spreadsheet = qs.spreadsheet;

    if (spreadsheet && spreadsheet.match(/^[A-Za-z0-9]+$/)) {
      if (spreadsheet == 'on') {
        spreadsheet = '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs';
      }

      spreadsheetToSpritesheet(spreadsheet, function(spriteLibrary) {
        startApp(spriteLibrary);
      });
    } else {
      startApp();
    }
  });
});
