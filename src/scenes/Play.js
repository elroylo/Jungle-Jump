class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    // initialize score
    //this.p1Score = 0;
      // display score
    /*let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#ffffff',
        color: '#000000',
        align: 'right',
        padding: {
        top: 5,
        bottom: 5,
        },
        fixedWidth: 100
    }*/
    update() {
        if (this.gameOver == true)
        {
            for(;game.global.loop < 1;game.global.loop++)
            {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, '← for Menu',).setOrigin(0.5);
            }
        }
    }








}