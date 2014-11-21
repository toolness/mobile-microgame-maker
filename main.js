require([
  "jsx!app",
  "spreadsheet-to-spritesheet",
  "jquery"
], function(app, spreadsheetToSpritesheet, $) {
  function startApp(spriteLibrary) {
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
    var spreadsheetMatch = window.location
      .search.match(/[&|?]spreadsheet=([A-Za-z0-9]+)/);

    if (spreadsheetMatch) {
      var spreadsheet = spreadsheetMatch[1];

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
