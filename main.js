require(["jsx!app", "jquery"], function(app, $) {
  $(function() {
    app({
      spreadsheetKey: '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs',
      root: document.documentElement,
      editorHolder: document.getElementById('editor-holder'),
      modalHolder: document.getElementById('modal-holder'),
      blocklyHolder: document.getElementById('blockly-holder')
    });
  });
});
