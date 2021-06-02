// Enemy prefab
class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
  
        // add object to existing scene
        scene.add.existing(this);
        enemy = this.physics.add.sprite(550,450, 'alien');
        //enemy2 = this.physics.add.sprite(1050,850, 'alien');
        player.setCollideWorldBounds(true);
        this.physics.add.collider(enemy, layer);
    }

    update() {
      
        if(this.y >= game.config.height) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.y = 0;
        this.x = Phaser.Math.Between(0, 900);
    }
}