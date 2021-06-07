var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);

// declaring variables
//var ammo;
var map;
var tileset;
var layer;
var pickups;
var player;
var platforms;
var cursors;
var movingPlatform;
var debug;
var source;
var target = new Phaser.Math.Vector2();
var playerCollision = false;
var gameOver = false;
var score = 0;
var speedinc = 0;
var xyinc;
var fuel = 2000;
var gameOverTest = 0;


/*
reserving wasd for movement
let keyA;
let keyS;
let keyD;
let keyW;
*/
// preloading assets
function preload ()
{
    this.load.image('tiles', './assets/gridtiles2.png');
    this.load.image('tiles', './assets/gridtiles2.png');
    this.load.tilemapTiledJSON('map', './assets/simple-map.json');
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
    this.load.audio('sfx_shoot', './assets/shoot.wav');
    
    
}

// creating assets 
function create ()
{
    background = this.add.sprite(400, 300, 'back');
    //  Set the camera and physics bounds to be the size of 4x4 bg images
    this.cameras.main.setBounds(0, 0, 800 * 2, 600 * 2);
    //this.physics.world.setBounds(0, 0, 800 * 2, 600 * 2);

    ammo = 1.05;
    text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);
    map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    tileset = map.addTilesetImage('tiles');
    layer = map.createLayer('Level1', tileset);

    map.setCollision([ 20, 48 ]);

    pickups = map.filterTiles(function (tile) {
        return (tile.index === 82);
    });

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // saw 1 test
    /*
    movingSaw1 = this.physics.add.image(300, 300, 'saw3');
    movingSaw1.setImmovable(true);
    movingSaw1.body.allowGravity = false;
    movingSaw1.setVelocityX(50);
    */
    
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');
    
    /*
    movingSaw1 = this.physics.add.image(400, 400, 'saw1');
    movingSaw1.scaleX= 2.5;
    movingSaw1.setImmovable(true);
    movingSaw1.body.allowGravity = false;
    movingSaw1.setVelocityY(80);
    */
    movingSaw2 = this.physics.add.image(400, 400, 'moving_platform');
    movingSaw2.setImmovable(true);
    movingSaw2.body.allowGravity = false;
    movingSaw2.setVelocityX(50);

    movingSaw3 = this.physics.add.image(400, 400, 'deadly_platform');
    movingSaw3.setImmovable(true);
    movingSaw3.body.allowGravity = false;
    movingSaw3.setVelocityY(50);
    

    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.01);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, layer);

    this.cameras.main.startFollow(player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1.25);
    
    player.setCollideWorldBounds(true);

    // player and platform collider
    this.physics.add.collider(player, platforms);
    //this.physics.add.collider(player, movingSaw1);
    this.physics.add.collider(player, movingSaw2);
    this.physics.add.collider(player, movingSaw3);


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
    

    fueltext = this.add.text(player.x - 200, player.y - 20, '', { fill: '#D5E27B' }).setDepth(1);
    scoretext = this.add.text(player.x - 200, player.y - 30, '', { fill: '#D5E27B' }).setDepth(1);
}

// updating assets
function update ()
{   
    fueltext.x = player.x;
    fueltext.y = player.y - 20;
    scoretext.x = player.x;
    scoretext.y = player.y - 40;
    // detecting Game Over
    if(checkPlayerCollision(player, movingSaw3) == true){
        gameOver = true;
    }
    // full game over detection
    if(gameOver == true && gameOverTest == 0){
        gameOverText = this.add.text(player.x, player.y, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
        restartText = this.add.text(player.x - 30, player.y + 90, 'Press <- to restart', { fontSize: '22px', fill: '#fff' });
        // don't delete these test casts vv
        // player.x, player.y,
        // 320, 240
        // 290, 330

        // TODO: implement restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            debugText = this.add.text(10, 10, 'GAME OVER', { fontSize: '12px', fill: '#fff' });
            this.scene.start("menuScene");
            }
        gameOverTest += 1;
    }
    
    text.setText([
        'Game Over: ' + gameOver,
        'Score: ' + score,
        'speed:' + speedinc,
    ]);
    fueltext.setText([
        'fuel:' + fuel,
    ]);
    scoretext.setText([
        'score:' + score,
    ]);
    gameoverText.setText([
        
    ])

    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);
        player.anims.play('left', true);
        player.x -= 2.5;


    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);
        player.anims.play('right', true);
        player.x += 2.5;

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
    if (movingSaw2.x >= 500)
    {
        movingSaw2.setVelocityX(-50);
    }
    else if (movingSaw2.x <= 300)
    {
        movingSaw2.setVelocityX(50);
    }
    if (movingSaw3.y >= 500)
    {
        movingSaw3.setVelocityY(-50);
    }
    else if (movingSaw3.y <= 300)
    {
        movingSaw3.setVelocityY(50);
    }
    

    this.physics.world.overlapTiles(player, pickups, hitPickup, null, this);
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
}
//
// end of update
//

function reset(){



}



// pick up function
function hitPickup (player, tile)
{
    map.removeTile(tile, 29, false);

    pickups = map.filterTiles(function (tile) {
        score += 10;
        fuel = 2000;
        
        return (tile.index === 82);
    });
}


function checkPlayerCollision(player, deadlyplatform) {
    if (player.x < deadlyplatform.x + deadlyplatform.width && 
        player.x + player.width > deadlyplatform.x && 
        player.y < deadlyplatform.y + deadlyplatform.height &&
        player.height + player.y > deadlyplatform. y){
            playerCollision = true;
            return true;
        }
        else{
            return false;
        }

}
