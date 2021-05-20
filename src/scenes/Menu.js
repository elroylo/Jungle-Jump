class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    
    create() {
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
    this.add.text(game.config.width/2, game.config.height/2, 'Use the arrowkeys to move and space to shoot', menuConfig).setOrigin(0.5);
    menuConfig.backgroundColor = '#90ee90';
    menuConfig.config = '#90ee90';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press <- to play', menuConfig).setOrigin(0.5);
    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }
    
    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 600000000000    
          }
          //this.sound.play('sfx_select');
          this.scene.start('playScene');
          game.global.health = 1;
          game.global.loop = 0;    
        }
      }
}