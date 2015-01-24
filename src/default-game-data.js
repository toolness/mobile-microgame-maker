define(function(require) {
  var assets = JSON.parse(require('text!assets.json'));
  var blocklyXml = require('text!default-blockly-xml.xml');

  var EMPTY_BLOCKLY_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

  return {
    sounds: assets.sounds,
    spritesheets: assets.spritesheets,
    animations: assets.animations,
    sprites: [],
    blocklyXml: blocklyXml,
    baseURL: 'assets/',
    width: 640,
    height: 480,
    backgroundColor: 0xf0f0f0
  };
});
