class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
        this.load.image('startButton', 'assets/start.png');
        this.load.image('backgroundMenu', 'assets/background_menu.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundMenu');
        this.add.text(250, 100, "Jogo do Labirinto", { fontSize: "48px", fill: "#fff" });
        let startButton = this.add.image(400, 400, 'startButton').setInteractive();
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.score = 0;
        this.hasKey = false;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('key', 'assets/key.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('door', 'assets/door.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('tiles', 'assets/tileset.png');
        this.load.image('backgroundGame', 'assets/background_game.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGame');
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("tileset", "tiles");
        map.createLayer("Ground", tileset, 0, 0);
        
        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        this.spawnKey();
        this.door = this.physics.add.sprite(500, 200, 'door');
        this.physics.add.overlap(this.player, this.door, this.enterDoor, null, this);
        
        this.enemy = this.physics.add.sprite(400, 200, 'enemy');
        this.enemy.setVelocity(100, 100);
        this.enemy.setBounce(1, 1);
        this.enemy.setCollideWorldBounds(true);

        this.scoreText = this.add.text(16, 16, 'Placar: 0', { fontSize: '32px', fill: '#fff' });

        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.physics.add.overlap(this.player, this.enemy, () => {
            this.scene.start('GameOverScene');
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(160);
        }
    }

    spawnKey() {
        if (this.keyItem) {
            this.keyItem.destroy();
        }
        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(50, 550);
        this.keyItem = this.physics.add.sprite(x, y, 'key');
        this.physics.add.overlap(this.player, this.keyItem, this.collectKey, null, this);
        this.hasKey = false;
    }

    collectKey(player, key) {
        this.score += 10;
        this.scoreText.setText('Placar: ' + this.score);
        key.destroy();
        this.hasKey = true;
    }

    enterDoor(player, door) {
        if (this.hasKey) {
            this.scene.start('GameScene2');
        }
    }
}

class GameScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene2' });
        this.peixeEntregue = false;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('gato', 'assets/gato.png');
        this.load.image('peixe', 'assets/peixe.png');
    }

    create() {
        this.player = this.physics.add.sprite(100, 300, 'player');
        this.gato = this.physics.add.sprite(50, 50, 'gato');
        this.peixe = this.physics.add.sprite(200, 300, 'peixe');
        this.peixe.setInteractive();
        this.input.on('pointerdown', () => this.coletarPeixe());
        this.temPeixe = false;

        this.add.text(50, 50, 'Pegue o peixe e entregue ao gato!', { fontSize: '20px', fill: '#fff' });
    }

    coletarPeixe() {
        if (!this.temPeixe) {
            this.temPeixe = true;
            this.peixe.destroy();
            console.log("Você pegou o peixe!");
        }
    }

    update() {
        if (this.temPeixe && Phaser.Geom.Intersects.RectangleToRectangle(this.personagem.getBounds(), this.gato.getBounds())) {
            this.entregarPeixe();
        }
    }

    entregarPeixe() {
        if (this.temPeixe) {
            console.log("Você entregou o peixe para o gato! Parabéns, fase concluída!");
            this.peixeEntregue = true;
            this.temPeixe = false;
            this.scene.start('WinScene'); // Muda para a cena de vitória
        }
    }
}

class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' });
    }

    preload() {
        this.load.image('winBackground', 'assets/background_win.png');
    }

    create() {
        this.add.image(400, 300, 'winBackground');
        this.add.text(300, 500, 'Parabéns! Você venceu!', { fontSize: '32px', fill: '#fff' });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [GameScene, GameScene2, WinScene]
};

const game = new Phaser.Game(config);
