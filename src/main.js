var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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

var game = new Phaser.Game(config);

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
}

// updating assets
function update ()
{
    // adds ammo over time
    if (ammo <= 1.05)
    {
    ammo += 0.002;
    }
    this.input.on('pointerdown', function (pointer) 
    {

      // the player should not be able to shoot with 0 ammo
        if (ammocount(ammo) == true)
        {
        ammo -= 0.1;
        this.sound.play('sfx_shoot');
        bullet = this.physics.add.sprite(player.x, player.y, 'star'); 
        target.x = pointer.x;
        target.y = pointer.y;
        // Move at 200 px/s:
        this.physics.moveToObject(bullet, target, 500);
        this.physics.add.collider(bullet, layer);
        bullet.setBounce(0.2);
    }
    }, this);
    text.setText([
        'ammo: ' + ammo,
        'greaterthanone: ' + ammocount(ammo),
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

    if (cursors.up.isDown && player.body.blocked.down)
    {
        player.setVelocityY(-330);
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

// collect star function
function collectStar (player, star)
{
    star.disableBody(true, true);
}

// pick up function
function hitPickup (player, tile)
{
    map.removeTile(tile, 29, false);

    pickups = map.filterTiles(function (tile) {
        return (tile.index === 82);
    });
}

// ammo count function
// purpose: counts the ammo in game
function ammocount (x)
{
    if (x > 1)
    {
        return true;
    }
    else
    {
        return false;
    }
}


