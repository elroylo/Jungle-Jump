var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [ Menu, Play ],
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    
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
var playerCollision;
var gameOver;
var score = 0;
var speedinc = 0;
var xyinc;
var fuel = 2000;
var gameOverTest = 0;
var movingPlatform1, movingPlatform2, movingPlatform3;

let keyLEFT, keyRIGHT, keyUP, keyDOWN;
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
/*
reserving wasd for movement
let keyA;
let keyS;
let keyD;
let keyW;
*/
// preloading assets


// creating assets 
