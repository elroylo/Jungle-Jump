gameCompleted = true;
class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    // debugger
    //gameCompleted = true;
    
    create() {
    /*
      if (!'sfx_music'.isPlaying)
      {
        this.sound.play('sfx_music');
      }*/
    // credits text configuration
        let creditsConfig = {
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

    //show credits text
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Credits:', creditsConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2, 'Gabriel and Elroy were our programmers, Mariel handled art and level design, and Gabriel did our sound design.', creditsConfig).setOrigin(0.5);
    creditsConfig.backgroundColor = '#0fFFf0';
    creditsConfig.config = '#000';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- to play again', creditsConfig).setOrigin(0.5);
    //this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Your Previous Score', gameOverScore).setOrigin(0.5);
    this.gameHighScore = this.add.text(300, 160, 'Your highest score: ' + highscore, { fontSize: '20px', fill: '#fff' });
    this.gameOverScore = this.add.text(300, 200, 'Your last score: ' + gameOverScore, { fontSize: '18px', fill: '#fff' });
    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.scene.start('playScene');
          game.global.gameOver = false;
          game.global.gameOverTest = 0;
          game.global.score = 0;
        }
      }
}