(function() {
  function render(spriteLibrary) {
    var initialGameData = defaultGameData;

    try {
      initialGameData = JSON.parse(window.sessionStorage['mmm_gamedata']);
    } catch (e) {}

    if (spriteLibrary) {
      initialGameData = React.addons.update(initialGameData, {
        spritesheets: {$set: spriteLibrary.spritesheets},
        animations: {$set: spriteLibrary.animations}
      });
    }

    function handleOpenBlockly() {
      document.documentElement.classList.add('show-blockly');
      Blockly.fireUiEvent(window, 'resize');
    }

    function handleCloseBlockly() {
      document.documentElement.classList.remove('show-blockly');
      editor.refreshBlocklyXml();
    }

    function handleGameDataChange(gameData) {
      window.sessionStorage['mmm_gamedata'] = JSON.stringify(gameData);
    }

    var blockly = React.render(
      <BlocklyComponent toolbox={document.getElementById('toolbox')} onClose={handleCloseBlockly}/>,
      document.getElementById('blockly-holder')
    );

    var editor = React.render(
      <Editor initialGameData={initialGameData} onOpenBlockly={handleOpenBlockly} onGameDataChange={handleGameDataChange} blockly={Blockly}/>,
      document.getElementById('editor')
    );

    // For debugging via console only!
    window.editor = editor;
  }

  function start() {
    if (/[&|?]local=1/.test(window.location.search))
      return render();

    var SPREADSHEET_KEY = '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs';
    spreadsheetToSpritesheet(SPREADSHEET_KEY, render);
  }

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', start, false);
  else
    start();
})();
