var Player = React.createClass({
  makePhaserState: function() {
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

    return {
      gameData: gameData,
      preload: function() {
        console.log('preload');
        this.gameData.spritesheets.forEach(function(info) {
          this.game.load.spritesheet(info.key, info.url, info.frameWidth,
                                     info.frameHeight);
        }, this);
      },
      create: function() {
        this.gameData.sprites.forEach(function(info) {
          var sprite = this.game.add.sprite(info.x, info.y, info.key);
          this.gameData.animations[info.key].forEach(function(animInfo) {
            sprite.animations.add(animInfo.name, animInfo.frames,
                                  animInfo.frameRate, animInfo.loop);
          });
          sprite.animations.play(info.animation);
        }, this);
        this.game.stage.backgroundColor = this.gameData.backgroundColor;
        this.game.paused = true;
      }
    }
  },
  getInitialState: function() {
    return {
      isPaused: true
    };
  },
  componentWillMount: function() {
    window.player = this;
  },
  handlePlayPause: function() {
    this.refs.stage.game.paused = !this.state.isPaused;
    this.setState({isPaused: !this.state.isPaused});
  },
  handleStop: function() {
    if (!this.state.isPaused)
      this.handlePlayPause();
    this.refs.stage.setPhaserState(this.makePhaserState());
  },
  render: function() {
    return (
      <div>
        <Stage ref="stage" width={320} height={240} phaserState={this.makePhaserState()}/>
        <div className="btn-group">
          <button type="button" className="btn btn-default" onClick={this.handlePlayPause}>
            <span className={'glyphicon '+ (this.state.isPaused ? 'glyphicon-play'
                                                                : 'glyphicon-pause')}></span>
          </button>
          <button type="button" className="btn btn-default" onClick={this.handleStop}>
            <span className="glyphicon glyphicon-stop"></span>
          </button>
        </div>
      </div>
    );
  }
});
