class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio and background
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.image('menuBackground', './assets/menuBackground.png');
        
    }
    
    create() {
    
    // menu text configuration
        let menuConfig = {
            //fontFamily: 'Times',
            fontSize: '20px',
            //backgroundColor: '#ff0000',
            color: '#ffffff',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        
    }

    // shows menu background
    this.menuBackground = this.add.sprite(1280/2, 720/2, 'menuBackground');

    // displays the jungle jump header title
    this.add.text(game.config.width/2 - 130, game.config.height/2 - borderUISize - borderPadding, 'Jungle Jump', { fontSize: '38px', fill: '#fff' });
    
    // menu screen
    if(game.global.gameCompleted != true){
      this.add.text(game.config.width/2, game.config.height/2 + 40, 'Use the arrow keys to move. ', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 80, 'Hold the up arrow key to use your jetpack and avoid the spikes.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 120, 'Collect the pears to gain fuel and apples to gain score.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 160, 'The faster you beat the game before the timer runs out—the more your score is multiplied.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 200, 'Press the left arrow key to play', menuConfig).setOrigin(0.5);
    }

    // credits screen
    if(game.global.gameCompleted == true){
      this.add.text(game.config.width/2, game.config.height/2 + 40, 'Credits:', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 80, 'Gabriel and Elroy were our programmers,', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 120, 'Mariel handled art and level design,', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 160, 'and Gabriel did our sound design.', menuConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/2 + 200, 'Press the left arrow key to play again', menuConfig).setOrigin(0.5);
    }

    //menuConfig.backgroundColor = '#0fFFf0';
    menuConfig.config = '#000';
    // displays highscore and your last score
    this.gameHighScore = this.add.text(470, 160, 'Your highest score: ' + highscore, { fontSize: '20px', fill: '#fff' });
    this.gameOverScore = this.add.text(470, 200, 'Your last score: ' + gameOverScore, { fontSize: '18px', fill: '#fff' });

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }
    
    // resets the global vars and goes to play scene
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