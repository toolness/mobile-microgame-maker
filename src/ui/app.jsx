define(function(require) {
  var Modal = require("jsx!./modals/modal");
  var BlocklyComponent = require("jsx!./blockly-component");
  var Editor = require("jsx!./editor");
  var React = require("react");
  var Blockly = require("../phaser-blocks");
  var GameData = require("../game-data");
  var defaultGameData = require("../default-game-data");
  var toolbox = require('text!blockly-toolbox.xml');

  return function createApp(options) {
    var root = options.root;
    var editorHolder = options.editorHolder;
    var modalHolder = options.modalHolder;
    var blocklyHolder = options.blocklyHolder;
    var assetLibrary = options.assetLibrary;
    var initialGameData = defaultGameData;
    var storage = options.storage;
    var storageKey = options.storageKey;

    if (options.importedGameData)
      handleGameDataChange(options.importedGameData);

    try {
      initialGameData = JSON.parse(storage[storageKey]);
    } catch (e) {}

    if (assetLibrary) {
      // Merge the external asset library w/ our built-in one,
      // giving priority to the external one.
      assetLibrary = GameData.maximize(assetLibrary, defaultGameData);
    } else {
      assetLibrary = defaultGameData;
    }

    function handleOpenBlockly() {
      root.classList.add('show-blockly');
      Blockly.fireUiEvent(window, 'resize');
    }

    function handleCloseBlockly() {
      root.classList.remove('show-blockly');
      editor.refreshBlocklyXml();
      Blockly.fireUiEvent(window, 'resize');
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

    function start() {
      modalManager = Modal.createManager(modalHolder);

      blockly = React.render(
        <BlocklyComponent toolbox={toolbox} onClose={handleCloseBlockly}/>,
        blocklyHolder
      );

      editor = self.editor = React.render(
        <Editor initialGameData={initialGameData} onOpenBlockly={handleOpenBlockly} onGameDataChange={handleGameDataChange} blockly={Blockly} onReset={handleReset} modalManager={modalManager} assetLibrary={assetLibrary}/>,
        editorHolder
      );
    }

    var modalManager, blockly, editor;
    var self = {
      reset: reset,
      start: start
    };

    return self;
  }
});
