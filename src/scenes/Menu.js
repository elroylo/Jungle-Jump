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
    this.add.text(game.config.width/2, game.config.height/2, 'Use the arrowkeys to move and right mouse click to shoot.', menuConfig).setOrigin(0.5);
    menuConfig.backgroundColor = '#0fFFf0';
    menuConfig.config = '#000';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- to play', menuConfig).setOrigin(0.5);
    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          this.sound.play('sfx_select');
          this.scene.start('playScene');
              
        }
      }
}