class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    // loads images, tilemaps, audios, and backgrounds
    preload () {
        this.load.image('tiles', './assets/gridtiles_1.png');
        this.load.tilemapTiledJSON('map', './assets/junglejump1.json');
        this.load.image('sky', './assets/sky.png');
        this.load.image('moving_platform', './assets/movingplatform.png');
        this.load.image('ground', './assets/platform.png');
        this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('back', './assets/background.png');
        this.load.audio('sfx_select', './assets/select.wav');
        this.load.audio('sfx_music', './assets/JungleJump.wav');
        this.load.audio('sfx_apple', './assets/apple.wav');
        this.load.audio('sfx_pear', './assets/pear.wav')
        this.load.audio('sfx_jetpack', './assets/jetpack.wav');
        this.load.audio('sfx_death', './assets/death.wav');
    }

    create () {
        // displays the game background that is 3200 x 3200
        this.background = this.add.sprite(3200, 3200, 'back');

        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 8000 * 2, 5600 * 2);

        // plays the music
        this.musicPlaying = this.sound.add('sfx_music', './assets/JungleJump.wav');
        this.musicPlaying.play();

        // initialization of tilemap
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
        
        // creates the moving platforms that will be generated throughout the map
        movingPlatform2 = this.physics.add.image(1600, 1100, 'moving_platform');
        movingPlatform2.setImmovable(true);
        movingPlatform2.body.allowGravity = false;
        movingPlatform2.setVelocityX(50);

        movingPlatform3 = this.physics.add.image(4600, 3600, 'moving_platform');
        movingPlatform3.setImmovable(true);
        movingPlatform3.body.allowGravity = false;
        movingPlatform3.setVelocityX(70);

        movingPlatform4 = this.physics.add.image(5100, 2100, 'moving_platform');
        movingPlatform4.setImmovable(true);
        movingPlatform4.body.allowGravity = false;
        movingPlatform4.setVelocityX(75);

        movingPlatform5 = this.physics.add.image(2400, 3050, 'moving_platform');
        movingPlatform5.setImmovable(true);
        movingPlatform5.body.allowGravity = false;
        movingPlatform5.setVelocityX(100);
        
        // creates player sprite
        player = this.physics.add.sprite(200, 1600, 'dude');
        player.setBounce(0.01);
        
        this.physics.add.collider(player, this.layer);

        // creates the camera follow and fixed zoom
        this.cameras.main.startFollow(player, true, 0.09, 0.09);
        this.cameras.main.setZoom(1);

        // player and platform collider
        this.physics.add.collider(player, movingPlatform2);
        this.physics.add.collider(player, movingPlatform3);
        this.physics.add.collider(player, movingPlatform4);
        this.physics.add.collider(player, movingPlatform5);
        this.physics.add.collider(player, this.platforms);
        this.physics.add.collider(player, this.movingPlatform2);
        this.physics.add.collider(player, this.movingPlatform3);
        this.physics.add.collider(player, this.movingPlatform4);
        this.physics.add.collider(player, this.movingPlatform5);

        // creating the animation for the player's movement
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
        
        // implements the text as well as their location and color for fuel, score, and time
        this.fueltext = this.add.text(player.x, player.y - 20, '', { fill: '#D5E27B' }).setDepth(1);
        this.scoretext = this.add.text(player.x, player.y - 30, '', { fill: '#D5E27B' }).setDepth(1);
        this.timetext = this.add.text(player.x, player.y - 40, '', { fill: '#D5E27B' }).setDepth(1);
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
        this.timetext.x = player.x;
        this.timetext.y = player.y - 80;
 
        

        // detecting Game Over
        //if(this.playerCollision == true){
        //    this.gameOver = true;
        //}

        // full game over detection
        if(game.global.gameOver == true && game.global.gameOverTest == 0){
            game.global.gameOverTest = 1;
            this.sound.play('sfx_death');
        }
        if(game.global.gameOver == true && game.global.gameOverTest == 1){
            gameOverScore = game.global.score;
            if(highscore < gameOverScore){
                highscore = gameOverScore;
            }
            this.musicPlaying.stop();
            this.scene.start("menuScene");
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

        // displays text next to player
        // displays fuel left
        this.fueltext.setText([
            'fuel:' + fuel,
        ]);
        // displays current score
        this.scoretext.setText([
            'score:' + game.global.score,
        ]);
        // displays current time left for speed bonus
        this.timetext.setText([
            'Time Left: ' + this.formatTime(this.initialTime),
        ]);
     
        // animations and velocity for left, right, and idle movement
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


        
        // jetpack functionality
        // if fuel is above 10, you can use fuel
        // if fuel is below 2000, you can charge your fuel back up
        if (cursors.up.isDown && speedinc >= -300 && fuel >= 10)
        {
            player.setVelocityY(speedinc);
            speedinc -= 10;
            fuel -= 10;
        }
        else if (speedinc <= 10 && fuel < 2100 )
        {
            player.setVelocityY(speedinc);
            speedinc += 15;
        }
        else if (fuel < 2000 && player.body.blocked.down)
        {
            fuel += 10;
            speedinc = 10;
        }
        
        
        // update for moving platforms
        //Platform2
        if (movingPlatform2.x >= 2000)
        {
            movingPlatform2.setVelocityX(-50);
        }
        else if (movingPlatform2.x <= 1590)
        {
            movingPlatform2.setVelocityX(50);
        }
        //Platform3
        if (movingPlatform3.x >= 5400)
        {
            movingPlatform3.setVelocityX(-50);
        }
        else if (movingPlatform3.x <= 4590)
        {
            movingPlatform3.setVelocityX(50);
        }
        //Platform4
        if (movingPlatform4.x >= 6000)
        {
            movingPlatform4.setVelocityX(-50);
        }
        else if (movingPlatform4.x <= 5090)
        {
            movingPlatform4.setVelocityX(50);
        }
        //Platform5
        if (movingPlatform5.x >= 3600)
        {
            movingPlatform5.setVelocityX(-50);
        }
        else if (movingPlatform5.x <= 2390)
        {
            movingPlatform5.setVelocityX(50);
        }
        
        // collision cases and rules for the tiles from the tilemaps
        // the this.hitpickup's are fruits
        // the this.hitdead are deadly tiles
        // escape is the finish line
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



// apple pick up function
// purpose: to pick up the apple
hitPickup (player, tile)
{
    this.sound.play('sfx_apple');
    this.map.removeTile(tile, 29, false);

    this.pickups = this.map.filterTiles(function (tile) {
        game.global.score += 0.5;
        return (tile.index === 82);
    });
}
// pear pick up function
// purpose: to pick up the pear
hitPickup2 (player, tile)
{
    this.sound.play('sfx_pear');
    this.map.removeTile(tile, 29, false);
    
    this.pickups2 = this.map.filterTiles(function (tile) {
        fuel = 2000;
        return (tile.index === 83);
    });
}
// death function for certain tiles in the tile map
// purpose: to prompt death after touching a deadly tile
hitdead ()
{
    game.global.gameOver = true;
}

// escape function
// purpose: allows a tile to have escape properties while
//          also allowing the post-game score implementation to happen
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



// checks for player collision with a deadly platform
// purpose: if there exists a collision to a deadlyplatform,
//          the player will die
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

// formats the time for the timer
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

// helps in the time formation and debugging
onEvent ()
{
    this.initialTime -= 1; // One second
    this.text.setText('Countdown: ' + this.formatTime(this.initialTime));
}
 
}