class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload () {
        //this.load.image('tiles', './assets/gridtiles2.png');
        this.load.image('tiles', './assets/gridtiles_1.png');
        //this.load.tilemapTiledJSON('map', './assets/simple-map.json');
        //this.load.tilemapTiledJSON('map', './assets/junglejump.json');
        this.load.tilemapTiledJSON('map', './assets/junglejump1.json');
        this.load.tilemapTiledJSON('map1', './assets/simple-map.json');
        this.load.image('sky', './assets/sky.png');
        this.load.image('moving_platform', './assets/movingplatform.png');
        this.load.image('deadly_platform', './assets/deadlyplatform.png');
        this.load.image('ground', './assets/platform.png');
        this.load.image('saw1', './assets/spike1.png');
        this.load.image('saw2', './assets/platform.png');
        this.load.image('saw3', './assets/platform.png');
        this.load.image('star', './assets/star.png');
        this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('sun', './assets/sun.png');
        this.load.image('alien', './assets/space-baddie.png');
        this.load.image('bullet', './assets/star.png');
        this.load.image('back', './assets/background.png');
        this.load.image('star_animation', './assets/star_animation.png');
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_jump', './assets/jump.wav');
        this.load.audio('sfx_music', './assets/JungleJump.wav');
        this.load.audio('sfx_apple', './assets/apple.wav');
        this.load.audio('sfx_pear', './assets/pear.wav')
        this.load.audio('sfx_jetpack', './assets/jetpack.wav');
        this.load.audio('sfx_death', './assets/death.wav');
    }
/*
    preload() {
        // load audio
        this.load.audio('sfx_jetpack', './assets/jetpack.wav');
        this.load.audio('sfx_death', './assets/death.wav');
        this.load.audio('sfx_fruit', './assets/fruit.wav');
    }
    */

    create () {
        this.background = this.add.sprite(3200, 3200, 'back');
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 8000 * 2, 5600 * 2);
        //this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);
        this.musicPlaying = this.sound.add('sfx_music', './assets/JungleJump.wav');
        this.musicPlaying.play();
        this.ammo = 1.05;
        this.text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);
        this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        this.tileset = this.map.addTilesetImage('tiles');
        this.layer = this.map.createLayer('Tile_Layer_1', this.tileset);
        // game clock time of 8 minutes
        this.initialTime = 480;
        
        this.map.setCollision([ 20, 48, 57, 58, 59, 71, 72, 73, 85, 86, 87, 99, 100, 101, 102, 103, 104, 105, 112, 113, 114, 115, 116, 117, 118, 119, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136]);
        this.map.setCollision([ 36, 37, 38, 39,]);
        this.pickups = this.map.filterTiles(function (tile) {return (tile.index === 82); });
        this.pickups2 = this.map.filterTiles(function (tile) {return (tile.index === 83); });
        this.spikeball = this.map.filterTiles(function (tile) {return (tile.index === 81); });
        this.gryupspike = this.map.filterTiles(function (tile) {return (tile.index === 94);});
        this.grydownspike = this.map.filterTiles(function (tile) {return (tile.index === 95);});
        this.brwnupspike = this.map.filterTiles(function (tile) {return (tile.index === 122);});
        this.brwndownspike = this.map.filterTiles(function (tile) {return (tile.index === 123);});
        this.exit = this.map.filterTiles(function (tile) {return (tile.index === 77); });
        this.platforms = this.physics.add.staticGroup();

        //this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        movingPlatform2 = this.physics.add.image(400, 400, 'moving_platform');
        movingPlatform2.setImmovable(true);
        movingPlatform2.body.allowGravity = false;
        movingPlatform2.setVelocityX(50);

        movingPlatform3 = this.physics.add.image(400, 400, 'deadly_platform');
        movingPlatform3.setImmovable(true);
        movingPlatform3.body.allowGravity = false;
        movingPlatform3.setVelocityY(50);
        

        player = this.physics.add.sprite(200, 1600, 'dude');
        player.setBounce(0.01);
        
        this.physics.add.collider(player, this.layer);

        this.cameras.main.startFollow(player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);

        // player and platform collider

        //this.physics.add.collider(player, movingPlatform1);
        this.physics.add.collider(player, movingPlatform2);
        this.physics.add.collider(player, movingPlatform3);
        this.physics.add.collider(player, this.platforms);
        this.physics.add.collider(player, this.movingPlatform);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
        

        this.fueltext = this.add.text(player.x, player.y - 20, '', { fill: '#D5E27B' }).setDepth(1);
        this.scoretext = this.add.text(player.x, player.y - 30, '', { fill: '#D5E27B' }).setDepth(1);
        this.timetext = this.add.text(player.x, player.y - 30, '', { fill: '#D5E27B' }).setDepth(1);
        timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });

    }

    // updating assets
    update ()
    {   
        // score multiplier
        scoreMultiplier = this.initialTime/25;
        this.fueltext.x = player.x;
        this.fueltext.y = player.y - 40;
        this.scoretext.x = player.x;
        this.scoretext.y = player.y - 60;
        //this.formatTime(this.initialTime)
        this.timetext.x = player.x;
        this.timetext.y = player.y - 80;
        //this.gameOverText.x = player.x;
        //this.GameOverText.y = player.y;

        

        // detecting Game Over
        if(this.checkPlayerCollision(player, movingPlatform3) == true){
            game.global.gameOver = true;
        }
        //if(this.playerCollision == true){
        //    this.gameOver = true;
        //}
        // full game over detection
        if(game.global.gameOver == true && game.global.gameOverTest == 0){
            game.global.gameOverTest = 1;
            this.sound.play('sfx_death');
            // don't delete these test casts vv
            // player.x, player.y,
            // 320, 240
            // 290, 330
            //this.scene.start("menuScene");
        }
        if(game.global.gameOver == true && game.global.gameOverTest == 1){
            gameOverScore = game.global.score;
            if(highscore < gameOverScore){
                highscore = gameOverScore;
            }
            this.musicPlaying.stop();
            this.scene.start("menuScene");
            //}
        }   
        
        this.text.setText([
            'Game Over: ' + game.global.gameOver,
            'Score: ' + game.global.score,
            'speed:' + speedinc,
            'gm_test: ' + game.global.gameOverTest,
            "check collision: " + this.checkPlayerCollision(player, movingPlatform3),
            //"Progress: " + timedEvent.getProgress().toString().substr(0, 4) + "%",
            'Countdown: ' + this.formatTime(this.initialTime),
        ]);
        this.fueltext.setText([
            'fuel:' + fuel,
        ]);
        this.scoretext.setText([
            'score:' + game.global.score,
        ]);
        this.timetext.setText([
            'Time Left: ' + this.formatTime(this.initialTime),
        ]);
     

        if (cursors.left.isDown)
        {
            player.setVelocityX(-320);
            player.anims.play('left', true);
            player.x -= 1.25;
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(320);
            player.anims.play('right', true);
            player.x += 1.25;

        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('turn');

        }


        

        if (cursors.up.isDown && speedinc >= -300 && fuel >= 10)
        {
            player.setVelocityY(speedinc);
            speedinc -= 10;
            fuel -= 10;
            //this.sound.play('sfx_jetpack');
            
        }
        else if (speedinc <= 10 && fuel < 2100 )
        {
            player.setVelocityY(speedinc);
            speedinc += 15;
        }
        else if (fuel < 2000 && player.body.blocked.down)
        {
            fuel += 10;
            speedinc = 10
            
        }
        
        
        // update for moving platform
        if (movingPlatform2.x >= 500)
        {
            movingPlatform2.setVelocityX(-50);
        }
        else if (movingPlatform2.x <= 300)
        {
            movingPlatform2.setVelocityX(50);
        }
        if (movingPlatform3.y >= 500)
        {
            movingPlatform3.setVelocityY(-50);
        }
        else if (movingPlatform3.y <= 300)
        {
            movingPlatform3.setVelocityY(50);
        }
        this.physics.world.overlapTiles(player, this.pickups, this.hitPickup,  null, this);
        this.physics.world.overlapTiles(player, this.pickups2, this.hitPickup2, null, this);
        this.physics.world.overlapTiles(player, this.spikeball, this.hitdead, null, this);
        this.physics.world.overlapTiles(player, this.grydownspike, this.hitdead, null, this);
        this.physics.world.overlapTiles(player, this.gryupspike, this.hitdead, null, this);
        this.physics.world.overlapTiles(player, this.brwndownspike, this.hitdead, null, this);
        this.physics.world.overlapTiles(player, this.brwnupspike, this.hitdead, null, this);
        this.physics.world.overlapTiles(player, this.exit, this.escape, null, this);
    }
//
//          end of update
//

reset(){

}



// pick up function
hitPickup (player, tile)
{
    this.sound.play('sfx_apple');
    this.map.removeTile(tile, 29, false);

    this.pickups = this.map.filterTiles(function (tile) {
        game.global.score += 1;
        return (tile.index === 82);
    });
}

hitPickup2 (player, tile)
{
    this.sound.play('sfx_pear');
    this.map.removeTile(tile, 29, false);
    
    this.pickups2 = this.map.filterTiles(function (tile) {
        fuel = 2000;
        return (tile.index === 83);
    });
}

hitdead ()
{
    game.global.gameOver = true;
}

escape ()
{
   // game.global.score = (game.global.score * scoreMultiplier);
    gameOverScore = game.global.score * (scoreMultiplier + 1);
    if(highscore < gameOverScore){
        highscore = gameOverScore;
    }
    game.global.gameCompleted = true;
    this.musicPlaying.stop();
    this.scene.start('menuScene');
}




checkPlayerCollision(player, deadlyplatform) {
    if (player.x < deadlyplatform.x + deadlyplatform.width && 
        player.x + player.width > deadlyplatform.x && 
        player.y < deadlyplatform.y + deadlyplatform.height &&
        player.height + player.y > deadlyplatform. y){
            this.playerCollision = true;
            return true;
        }
        else{
            return false;
        }

}
formatTime(seconds){
    // Minutes
    var minutes = Math.floor(seconds/60);
    // Seconds
    var partInSeconds = seconds%60;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${minutes}:${partInSeconds}`;
}


onEvent ()
{
    this.initialTime -= 1; // One second
    this.text.setText('Countdown: ' + this.formatTime(this.initialTime));
}
 
}