(function() {
  var defaultGameData = {
    spritesheets: [
      {
        key: 'fly',
        url: 'img/fly-flying.png',
        frameWidth: 80,
        frameHeight: 92
      }
    ],
    animations: {
      'fly': [
        {
          name: 'flying',
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          frameRate: 10,
          loop: true
        },
        {
          name: 'dead',
          frames: [3],
          frameRate: 10,
          loop: true            
        }
      ]
    },
    sprites: [
      {
        id: '3799a7b6-1576-0a79-8cd5-72a0f5e48759',
        name: 'Object1',
        x: 0,
        y: 0,
        key: 'fly',
        animation: 'flying'
      },
      {
        id: '3c48f505-4ab3-3724-f578-59d7efe857f4',
        name: 'Object2',
        x: 150,
        y: 0,
        key: 'fly',
        animation: 'dead'
      }
    ],
    blocklyXml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    width: 288,
    height: 216,
    backgroundColor: 0xf0f0f0
  };

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

    Tabletop.init({
      key: '15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs',
      callback: function(data) {
        var spritesheets = [];
        var animations = {};
        var lastSpritesheetKey;
        data.forEach(function(row) {
          var key = row.spritesheetkey || lastSpritesheetKey;
          if (row.spritesheetkey) {
            spritesheets.push({
              key: key,
              url: row.url,
              frameWidth: parseInt(row.framewidth),
              frameHeight: parseInt(row.frameheight)
            });
            lastSpritesheetKey = key;
            animations[key] = [];
          }
          if (row.animationkey && key) {
            animations[key].push({
              name: row.animationkey,
              frames: row.animationframes.split(',').map(function(frame) {
                return parseInt(frame.trim());
              }),
              frameRate: parseInt(row.animationfps),
              loop: row.animationloop == "TRUE"
            });
          }
        });
        render({
          spritesheets: spritesheets,
          animations: animations
        });
      },
      simpleSheet: true
    });
  }
  
  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', start, false);
  else
    start();
})();
