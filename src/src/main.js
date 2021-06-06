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
// declaring variables
var ammo;
var map;
var tileset;
var layer;
var pickups;
var player;
var stars;
var bullet;
var platforms;
var cursors;
var movingPlatform;
var debug;
var source;
var target = new Phaser.Math.Vector2();
var distanceText;
var distanceEnemy;
var starCollision = false;
var playerCollision = false;
var gameOver = false;
var score = 0;
var jumps;
var canDoubleJump;
var speedinc = 0;
var xyinc;
var fuel = 1000;

var game = new Phaser.Game(config);

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

    
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    /* movingSaw1 = this.physics.add.image(400, 400, 'saw1');
    movingSaw1.scaleX= 2.5;
    movingSaw1.setImmovable(true);
    movingSaw1.body.allowGravity = false;
    movingSaw1.setVelocityY(80);

    movingSaw2 = this.physics.add.image(400, 400, 'saw2');
    movingSaw2.setImmovable(true);
    movingSaw2.body.allowGravity = false;
    movingSaw2.setVelocityX(100);

    movingSaw3 = this.physics.add.image(400, 400, 'saw3');
    movingSaw3.setImmovable(true);
    movingSaw3.body.allowGravity = false;
    movingSaw3.setVelocityY(150);
    */

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.01);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, layer);

    //enemy2 = this.physics.add.sprite(1050,850, 'alien');
    player.setCollideWorldBounds(true);

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
    this.physics.add.collider(player, platforms);
    //this.physics.add.collider(player, movingSaw1);
    this.physics.add.collider(player, movingPlatform);
    fueltext = this.add.text(player.x, player.y - 20, '', { fill: '#00ff00' }).setDepth(1);
}

// updating assets
function update ()
{   
    fueltext.x = player.x;
    fueltext.y = player.y - 20;
    // detecting Game Over
    if(playerCollision == true){
        gameOver = true;
    }
    // full game over detection
    if(gameOver == true){
        gameOverText = this.add.text(320, 240, 'GAME OVER', { fontSize: '32px', fill: '#fff' });
        restartText = this.add.text(290, 330, 'Press <- to restart', { fontSize: '22px', fill: '#fff' });
        // TODO: implement restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            debugText = this.add.text(10, 10, 'GAME OVER', { fontSize: '12px', fill: '#fff' });
            this.scene.start("menuScene");
            }
    }

    text.setText([
        'Game Over: ' + gameOver,
        'Score: ' + score,
        'speed:' + speedinc,
    ]);
    fueltext.setText([
        'fuel:' + fuel,
    ]);
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(-320);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(320);

        player.anims.play('right', true);
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
    else if (speedinc <= 10 && fuel < 2000 )
    {
        player.setVelocityY(speedinc);
        speedinc += 15;
    }
    else if (fuel < 2000 && player.body.blocked.down)
    {
        fuel += 10;
        speedinc = 10
    }
    
    
    /*
    if (movingSaw1.x >= 500)
    {
        movingSaw1.setVelocityX(-50);
    }
    else if (movingSaw1.x <= 300)
    {
        movingSaw1.setVelocityX(50);
    }
    */
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
        return (tile.index === 82);
    });
}

// ammo count function
// purpose: counts the ammo in game

function checkPlayerCollision(player, enemy) {
    if (player.x < enemy.x + enemy.width && 
        player.x + player.width > enemy.x && 
        player.y < enemy.y + enemy.height &&
        player.height + player.y > enemy. y){
            playerCollision = true;
            return true;
        }
        else{
            return false;
        }

}
