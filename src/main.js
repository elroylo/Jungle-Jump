let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
  }
  let game = new Phaser.Game(config);
  game.global = {
    health: 1,
    loop: 0,
   }
  // reserve keyboard vars
  let keyF, keyR, keyLEFT, keyRIGHT, keyLEFT2, keyRIGHT2, keyF2;
  let borderUISize = game.config.height / 15;
  let borderPadding = borderUISize / 3;