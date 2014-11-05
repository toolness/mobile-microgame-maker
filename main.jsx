$(function() {
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
        x: 0,
        y: 0,
        key: 'fly',
        animation: 'flying'
      },
      {
        x: 150,
        y: 0,
        key: 'fly',
        animation: 'dead'
      }
    ],
    backgroundColor: 0xf0f0f0
  };

  var main = React.render(
    <div className="container">
      <h1>Mobile Microgame Maker</h1>
      <Editor initialGameData={gameData}/>
    </div>,
    $('#main')[0]
  );
});
