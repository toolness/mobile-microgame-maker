(function() {
  var gameData = {
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
        x: 0,
        y: 0,
        key: 'fly',
        animation: 'flying'
      },
      {
        id: '3c48f505-4ab3-3724-f578-59d7efe857f4',
        x: 150,
        y: 0,
        key: 'fly',
        animation: 'dead'
      }
    ],
    width: 288,
    height: 216,
    backgroundColor: 0xf0f0f0
  };

  function start() {
    var editor = React.render(
      <Editor initialGameData={gameData}/>,
      document.getElementById('editor')
    );

    // For debugging via console only!
    window.editor = editor;
  }

  if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', start, false);
  else
    start();
})();
