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
        this.physics.add.overlap(this.player, this.enemy, this.gameOver, null, this);



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

    // Função chamada quando o jogador colide com o inimigo
    gameOver() {
        this.scene.start('GameOverScene'); // Inicia a cena de Game Over
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        this.load.image('backgroundGameOver', 'assets/background_gameover.png'); // Defina sua imagem de Game Over
    }

    create() {
        this.add.image(400, 300, 'backgroundGameOver'); // Adiciona o background de Game Over
        this.add.text(280, 280, 'Game Over! Você perdeu!', { fontSize: '32px', fill: '#fff' });

        // Botão para reiniciar o jogo
        let restartButton = this.add.text(350, 350, 'Reiniciar', { fontSize: '32px', fill: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('GameScene'); // Reinicia a fase
            });
    }
}

class GameScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene2' });
        // this.peixeEntregue = false;
        this.temPeixe = false;
    }

    preload() {
        this.load.image('player', 'assets/player.png');
        this.load.image('gato', 'assets/gato.png');
        this.load.image('peixe', 'assets/peixe.png');
        this.load.image('backgroundGame2', 'assets/background_game2.png');
        this.load.image('coracao', 'assets/coracao.png');
    }

    create() {
        this.add.image(400, 300, 'backgroundGame2');
        this.add.text(16, 16, 'Pegue o peixe e entregue ao gato!', { fontSize: '20px', fill: '#fff' });

        this.player = this.physics.add.sprite(100, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);

        // Definindo a profundidade para que o jogador fique acima do peixe e do gato
        this.player.setDepth(2);

        this.gato = this.physics.add.sprite(400, 400, 'gato');
        this.gato.setDepth(1); // Gato fica atrás do jogador

        this.peixe = this.physics.add.sprite(500, 300, 'peixe');
        this.peixe.setDepth(1); // Peixe fica atrás do jogador

        this.physics.add.overlap(this.player, this.peixe, this.coletarPeixe, null, this);
        this.physics.add.overlap(this.player, this.gato, this.entregarPeixe, null, this);

        // Definindo os controles do jogador
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    coletarPeixe() {
       if (!this.temPeixe){
        this.temPeixe = true;
        this.peixe.destroy();
       }
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

        // Verificando se o jogador entregou o peixe ao gato
        if (this.temPeixe && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.gato.getBounds())) {
            this.entregarPeixe();
        }
    }

    entregarPeixe() {
        if(this.temPeixe){
            this.coracao = this.add.image(400, 350, 'coracao').setDepth(2); 
            this.time.delayedCall(500, () => {
                this.scene.start('WinScene');
            });         
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
    scene: [MenuScene, GameScene, GameOverScene, GameScene2, WinScene]
};

const game = new Phaser.Game(config);
