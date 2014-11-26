define(function(require) {
  var Modal = require("jsx!modal");
  var BlocklyComponent = require("jsx!blockly-component");
  var Editor = require("jsx!editor");
  var React = require("react");
  var Blockly = require("phaser-blocks");
  var defaultGameData = require("default-game-data");
  var toolbox = require('text!blockly-toolbox.xml');

  return function start(options) {
    var root = options.root;
    var editorHolder = options.editorHolder;
    var modalHolder = options.modalHolder;
    var blocklyHolder = options.blocklyHolder;
    var spriteLibrary = options.spriteLibrary;
    var initialGameData = defaultGameData;
    var storage = options.storage;
    var storageKey = options.storageKey;

    if (options.importedGameData)
      handleGameDataChange(options.importedGameData);

    try {
      initialGameData = JSON.parse(storage[storageKey]);
    } catch (e) {}

    if (spriteLibrary) {
      initialGameData = React.addons.update(initialGameData, {
        spritesheets: {$set: spriteLibrary.spritesheets},
        animations: {$set: spriteLibrary.animations}
      });
    }

    function handleOpenBlockly() {
      root.classList.add('show-blockly');
      Blockly.fireUiEvent(window, 'resize');
    }

    function handleCloseBlockly() {
      root.classList.remove('show-blockly');
      editor.refreshBlocklyXml();
    }

    function handleGameDataChange(gameData) {
      storage[storageKey] = JSON.stringify(gameData);
    }

    function reset() {
      delete storage[storageKey];
      window.location.reload();
    }

    function handleReset() {
      if (window.confirm("Reset this app to its factory defaults, destroying your game? This cannot be undone!"))
        reset();
    }

    var modalManager, blockly, editor;

    try {
      modalManager = Modal.createManager(modalHolder);

      blockly = React.render(
        <BlocklyComponent toolbox={toolbox} onClose={handleCloseBlockly}/>,
        blocklyHolder
      );

      editor = React.render(
        <Editor initialGameData={initialGameData} onOpenBlockly={handleOpenBlockly} onGameDataChange={handleGameDataChange} blockly={Blockly} onReset={handleReset} modalManager={modalManager}/>,
        editorHolder
      );
    } catch (e) {
      window.setTimeout(function() {
        if (window.confirm("A fatal error occured! Reset this app to its factory defaults? Your data will be lost."))
          reset();
      }, 250);
      throw e;
    }

    return editor;
  }
});
