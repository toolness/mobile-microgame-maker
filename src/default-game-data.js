define(function(require) {
  var spritesheets = JSON.parse(require('text!spritesheets.json'));

  return {
    sounds: [
      {
        key: 'blop',
        url: 'sounds/Blop-Mark_DiAngelo.mp3'
      },
      {
        key: 'woosh',
        url: 'sounds/Woosh-Mark_DiAngelo.mp3'
      }
    ],
    spritesheets: spritesheets.spritesheets,
    animations: spritesheets.animations,
    sprites: [],
    blocklyXml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    baseURL: 'assets/',
    width: 288,
    height: 216,
    backgroundColor: 0xf0f0f0
  };
});
