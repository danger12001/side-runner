// Create our 'main' state that will contain the game
var mainState = {
    preload: function() {

        game.load.image('player', 'player.png');
        game.load.image('block', 'floor.png');
    },

    create: function() {
        //lower the duration the faster the speed of the game.
        this.duration = 1200;

        //adding blocks
        this.blocks = game.add.group();

        //background and physics engine
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // adding player and Initializing physics
        this.player = game.add.sprite(100, 350, 'player');
        game.physics.arcade.enable(this.player);

        //game loop itself
        this.timer = game.time.events.loop(this.duration, this.addBlock, this);

        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", {
            font: "30px Arial",
            fill: "#ffffff"
        });

    },
    removeBlock: function(block) {
        block.destroy();
        this.score += 1;
        this.labelScore.text = this.score;
    },

    addBlock: function() {
        //picks a random point on the x axis.
        var rand = Math.floor(Math.random() * 399) + 1;
        this.block = game.add.sprite(rand, 0, 'block');
        //adds sprite to group.
        this.blocks.add(this.block);

        //enable physics
        game.physics.arcade.enable(this.block);
        this.block.body.gravity.y = 1000;

        //event checking world bounds of block and removes them.
        this.block.checkWorldBounds = true;
        this.block.events.onOutOfBounds.add(this.removeBlock, this);
    },

    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    update: function() {

        //keyboard mapping
        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        if (leftKey.isDown && this.player.x > 0) {
            this.player.x -= 5;
        } else if (leftKey.isDown && this.player.x < 400) {
            this.player.x = 400;
        }

        if (rightKey.isDown && this.player.x < 400) {
            this.player.x += 5;
        } else if (rightKey.isDown && this.player.x > 0) {
            this.player.x = 0;
        }
        //


        //game over collision
        game.physics.arcade.overlap(
            this.player, this.blocks, this.restartGame, null, this);

    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
