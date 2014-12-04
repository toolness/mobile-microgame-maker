define(function(require) {
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
    spritesheets: [
      {
        key: 'fly',
        url: 'img/fly-flying.png',
        frameWidth: 80,
        frameHeight: 92
      },
      {
        key: 'grumpaloomba',
        url: 'img/grumpaloomba-06.png',
        frameWidth: 75,
        frameHeight: 73
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
      ],
      'grumpaloomba': [
        {
          name: 'grumpy',
          frames: [0],
          frameRate: 1,
          loop: false
        }
      ]
    },
    sprites: [],
    blocklyXml: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>',
    baseURL: 'assets/',
    width: 288,
    height: 216,
    backgroundColor: 0xf0f0f0
  };
});
