class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/select.wav');
        
    }
    
    create() {
    /*
      if (!'sfx_music'.isPlaying)
      {
        this.sound.play('sfx_music');
      }*/
    // menu text configuration
        let menuConfig = {
            fontFamily: 'Times',
            fontSize: '28px',
            backgroundColor: '#ff0000',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        
    }

    //show menu text
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Jungle Jump', menuConfig).setOrigin(0.5);

    if(game.global.gameCompleted != true){
      this.add.text(game.config.width/2, game.config.height/2, 'Use the arrow keys to move. ', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 40, 'Hold space to use your jetpack and avoid the spikes.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 80, 'Collect the pears to gain fuel and apples to gain score.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 120, 'The faster you beat the game the more your score is multiplied.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 160, 'Press <- to play', menuConfig).setOrigin(0.5);
    }
    if(game.global.gameCompleted == true){
      this.add.text(game.config.width/2, game.config.height/2, 'Credits:', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 40, 'Gabriel and Elroy were our programmers,', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 80, 'Mariel handled art and level design,', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 120, 'and Gabriel did our sound design.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 160, 'Press <- to play again', menuConfig).setOrigin(0.5);
    }
    menuConfig.backgroundColor = '#0fFFf0';
    menuConfig.config = '#000';
    this.gameHighScore = this.add.text(270, 160, 'Your highest score: ' + highscore, { fontSize: '20px', fill: '#fff' });
    this.gameOverScore = this.add.text(270, 200, 'Your last score: ' + gameOverScore, { fontSize: '18px', fill: '#fff' });

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.sound.play('sfx_select');
          this.scene.start('playScene');
          game.global.gameOver = false;
          game.global.gameOverTest = 0;
          game.global.score = 0;
          game.global.gameCompleted = 0;
        }
      }
}