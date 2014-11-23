define(function(require) {
  var _ = require('underscore');
  var guid = require('guid');
  var React = require('react');
  var PhaserState = require('phaser-state');
  var GameData = require('game-data');
  var Player = require('jsx!player');
  var Sprite = require('jsx!sprite');
  var ExportModal = require('jsx!export-modal');
  var ImportModal = require('jsx!import-modal');

  var Editor = React.createClass({
    makePhaserState: function(options) {
      var blockly = this.props.blockly;
      var gameData = this.state.gameData;

      var state = PhaserState.Generators.makeStateObject({
        autoplay: options.autoplay,
        gameData: gameData,
        start: blockly.Phaser.generateJs(gameData),
        onGameEnded: options.onGameEnded
      });

      return state;
    },
    getInitialState: function() {
      return {
        undo: [],
        redo: [],
        gameData: this.props.initialGameData
      };
    },
    changeGameData: function(changes) {
      this.setState(React.addons.update(this.state, {
        undo: {$push: [this.state.gameData]},
        redo: {$set: []},
        gameData: changes
      }));    
    },
    findUnusedSpriteName: function(baseName) {
      var names = _.pluck(this.state.gameData.sprites, 'name');
      for (var i = 1; i < 10000; i++) {
        var candidate = baseName + i;
        if (names.indexOf(candidate) == -1) return candidate;
      }
      throw new Error('maximum number of sprites reached');
    },
    handleAddSprite: function() {
      var spritesheet = this.state.gameData.spritesheets[0];
      var animation = this.state.gameData.animations[spritesheet.key][0];

      this.changeGameData({
        sprites: {
          $push: [{
            id: guid(),
            name: this.findUnusedSpriteName(spritesheet.key),
            x: _.random(this.state.gameData.width - spritesheet.frameWidth),
            y: _.random(this.state.gameData.height - spritesheet.frameHeight),
            key: spritesheet.key,
            animation: animation.name
          }]
        }
      });
    },
    spriteIndex: function(id) {
      return GameData.spriteIndex(this.state.gameData, id);
    },
    handleChangeSprite: function(id, changes) {
      var index = this.spriteIndex(id);
      var sprites = {};
      sprites[index] = changes;
      this.changeGameData({sprites: sprites});
    },
    handleRemoveSprite: function(id) {
      this.changeGameData({
        sprites: {
          $splice: [[this.spriteIndex(id), 1]]
        }
      });
    },
    handleUndo: function() {
      this.setState(React.addons.update(this.state, {
        undo: {$splice: [[-1, 1]]},
        redo: {$push: [this.state.gameData]},
        gameData: {$set: this.state.undo[this.state.undo.length - 1]}
      }));
    },
    handleRedo: function() {
      this.setState(React.addons.update(this.state, {
        undo: {$push: [this.state.gameData]},
        redo: {$splice: [[-1, 1]]},
        gameData: {$set: this.state.redo[this.state.redo.length - 1]}
      }));
    },
    refreshBlocklyXml: function() {
      var blockly = this.props.blockly;
      var xml = blockly.Xml.workspaceToDom(blockly.mainWorkspace);

      xml = blockly.Xml.domToText(xml);
      console.log('refresh blockly xml', xml);
      if (xml == this.state.gameData.blocklyXml) return;
      this.changeGameData({
        blocklyXml: {$set: xml}
      });
    },
    handleOpenBlockly: function() {
      this.props.onOpenBlockly();
      this.props.blockly.Phaser.setGameData(this.state.gameData);
    },
    handleReset: function(e) {
      e.preventDefault();
      this.props.onReset();
    },
    handleExport: function(e) {
      e.preventDefault();
      this.props.modalManager.show(ExportModal, {
        gameData: this.state.gameData
      });
    },
    handleImport: function(e) {
      e.preventDefault();
      this.props.modalManager.show(ImportModal, {
        onSave: this.importGameData
      });
    },
    importGameData: function(gameData) {
      this.changeGameData({
        $set: gameData
      });
    },
    componentDidUpdate: function(prevProps, prevState) {
      if (prevState.gameData !== this.state.gameData)
        this.props.onGameDataChange(this.state.gameData);
    },
    render: function() {
      return (
        <div>
          <Player gameData={this.state.gameData} makePhaserState={this.makePhaserState}/>
          <br/>
          <ul className="list-group">
          {this.state.gameData.sprites.map(function(sprite) {
            return <Sprite sprite={sprite} key={sprite.id} gameData={this.state.gameData} onRemove={this.handleRemoveSprite} onChange={this.handleChangeSprite} modalManager={this.props.modalManager}/>
          }, this)}
          </ul>
          <button type="button" className="btn btn-default btn-block" onClick={this.handleOpenBlockly}>
            Code&hellip;
          </button>
          <br/>
          <div className="btn-group btn-group-justified">
            <div className="btn-group">
              <button type="button" className="btn btn-default" onClick={this.handleAddSprite}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-default" disabled={!this.state.undo.length} onClick={this.handleUndo}>
                Undo
              </button>
            </div>
            <div className="btn-group">
              <button type="button" className="btn btn-default" disabled={!this.state.redo.length} onClick={this.handleRedo}>
                Redo
              </button>
            </div>
            <div className="btn-group dropup">
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                <strong>&hellip;</strong>
              </button>
              <ul className="dropdown-menu dropdown-menu-right" role="menu">
                <li><a href="#" onClick={this.handleReset}><span className="glyphicon glyphicon-off"></span> Reset App</a></li>
                <li><a href="#" onClick={this.handleExport}><span className="glyphicon glyphicon-export"></span> Export to HTML</a></li>
                <li><a href="#" onClick={this.handleImport}><span className="glyphicon glyphicon-import"></span> Import from HTML</a></li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
  });

  return Editor;
});
