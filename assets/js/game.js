var gameScene = new Phaser.Scene("game");

var koi;
var keys;
var camera;

var padGroup;

var bugs;
var bugsText;
var bugsCount = 1;

gameScene.preload = function() {
    this.load.image('pond', 'assets/png/pondbottom.png');
    this.load.spritesheet('koiboi', 'assets/png/koi-spritesheet.png', 
        {frameWidth: 108, frameHeight: 58});
    this.load.image('land1', 'assets/png/pondedgeleft.png');
    this.load.image('land2', 'assets/png/pondedgeright.png');
    this.load.image('pad1', 'assets/png/pads/pad01.png');
    this.load.image('pad2', 'assets/png/pads/pad02.png');
    this.load.image('pad3', 'assets/png/pads/pad03.png');
    this.load.image('pad4', 'assets/png/pads/pad04.png');
    this.load.image('dragon', 'assets/png/bugs/dragonfly.png');
    this.load.image('spidey', 'assets/png/bugs/waterspider.png');
    this.load.image('fly', 'assets/png/bugs/fly.png');
    this.load.image('worm', 'assets/png/bugs/worm.png')
}

gameScene.create = function() {

    //set up world bounds, camera and movement input
        this.physics.world.setBounds(50, -500, 350 * 2, 500 * 2);
        this.cameras.main.setBounds(0, -500, 350 * 2, 500 * 2);
        keys = this.input.keyboard.createCursorKeys();

    //add background image(s)
        this.add.image(0, -500, 'pond').setFlipX(true).setOrigin(0);
        this.add.image(400, -500, 'pond').setFlipX(true).setOrigin(0);
        this.add.image(0, 0, 'pond').setOrigin(0);
        this.add.image(400, 0, 'pond').setOrigin(0);
        
    //add and set up sprite
        this.player = this.physics.add.sprite(400, 430, 'koiboi');
        koi = this.player;
        koi.angle = -90;
        koi.body.enable = true;
        koi.body.setCircle(35, 0, -35);
        koi.setScale(0.8);
        koi.body.collideWorldBounds = true;
        koi.anchor = 0.5, 0.5;
        
        this.cameras.main.startFollow(koi, true);
        
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('koiboi', 
            { frames: [ 0, 1, 2, 3, 4, 5, 6, 7 ] }),
            frameRate: 8,
            repeat: -1
        });

    //add a semi-transparent layer to mimic water surface
        this.add.rectangle(400, 0, 800, 1000, 0x99d9ea, 0.4);

    //add ornamental edges (accounted for in world bounds)
        this.add.image(200, 250, 'land1');
        this.add.image(200, -250, 'land1');
        this.add.image(600, 250, 'land2');
        this.add.image(600, -250, 'land2');

    //add collison elements at random points in rows,

        padGroup = this.physics.add.staticGroup({
            key: ['pad1', 'pad2', 'pad3', 'pad4'],
            frameQuantity: 10,
            
        });

        var pads = padGroup.getChildren();

        for (var i = 0; i < pads.length; i++) {
            var x = Phaser.Math.Between(100, 700);
            var y = Phaser.Math.Between(300, -350);

            pads[i].setPosition(x, y).body.setCircle(10);
            
        }

        padGroup.refresh();

        this.physics.add.collider(koi, padGroup)

    //add collectable elements

        bugsGroup = this.physics.add.staticGroup({
            key: ['dragon', 'spidey', 'fly'],
            frameQuantity: 4,
            immovable: true
        });

        const bugs = bugsGroup.getChildren();

        for (var i = 0; i < bugs.length; i++)
        {
            var x = Phaser.Math.Between(100, 700);
            var y = Phaser.Math.Between(350, -500);

            bugs[i].setPosition(x, y);
        }

        bugsGroup.refresh();

        this.physics.add.collider(koi, bugsGroup, bugHit);

        bugsCount = bugs.length;
        bugsText = this.add.text(100, 20, 'Bugs left: ' + bugsCount, {
            font: 'bold 32px Courier',
            fill: '#FFFFFF',
        });
        bugsText.scrollFactorX = 0;
        bugsText.scrollFactorY = 0;
        
}

function bugHit (koi, bug) {
    bugsGroup.killAndHide(bug);
    bug.body.enable = false;
    bugsCount -= 1;
}

function gameOver () {
    if (bugsCount === 0) {
        return true;
    }
    while (bugsCount > 0) {
        return false;
    }
}

gameScene.update = function() {
    bugsText.setText('Bugs left: ' + bugsCount);

    koi.setVelocity(0);
    koi.setAngularVelocity(0);

    if (keys.up.isDown) {
        koi.play('swim', true);

        this.physics.velocityFromAngle(koi.angle, 200, koi.body.velocity);
            
        if (keys.right.isDown) {
            koi.setAngularVelocity(175);
            koi.play('swim', true)
        } else if (keys.left.isDown) {
            koi.setAngularVelocity(-175);
            koi.play('swim', true)
        } 
    } else if (keys.right.isDown) {
        koi.setAngularVelocity(175);
        koi.play('swim', true)
    } else if (keys.left.isDown) {
        koi.setAngularVelocity(-175);
        koi.play('swim', true)
    } else {
        koi.stop();
        koi.setFrame(4)
    }

    if (gameOver()) {
    game.scene.remove('game');
    game.scene.start('end');
    }
    //debugging
}

