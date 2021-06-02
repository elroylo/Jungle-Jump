class Star extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);   // add to existing, displayList, updateList
        var ammo;
        var stars;
        var bullet;
        var target = new Phaser.Math.Vector2();
    }
        update(){
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






        }

}
