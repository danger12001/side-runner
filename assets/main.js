// Create our 'main' state that will contain the game
var mainState = {
        preload: function() {

            game.load.image('player', 'player.png');
            game.load.image('button', 'player.png');
            game.load.image('block', 'floor.png');
            game.load.image('coin', 'coin.png');
        },
        create: function() {
          var button;
            button = game.add.button(325, 20, 'button', actionOnClick, this, 2, 1, 0);

            var lastDelay = [];
            function actionOnClick() {
              if(!this.paused){
                console.log('paused');
                this.player.kill();
                this.block.kill();
                game.stage.backgroundColor = '#c5c5c5';
                lastDelay[0] = this.timer.delay;
                this.paused = !this.paused;
                game.time.events.remove(this.timer);
                console.log(this.timer);
              } else {
              game.stage.backgroundColor = '#71c5cf';
                console.log('resumed');
                this.player.revive();
                this.block.revive();
                this.paused = !this.paused;
                this.timer = game.time.events.loop(lastDelay[0], this.addBlock, this);

              }

            }

        this.score = 0;
        this.labelPaused = game.add.text(20, 20, "", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.labelScore = game.add.text(20, 100, "Score: 0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.labelHealth = game.add.text(20, 20, "Health: 100", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        this.labelUpgrades = game.add.text(20, 60, "Upgrade Points: 0", {
            font: "30px Arial",
            fill: "#ffffff"
        });
        //lower the duration the faster the speed of the game.

        this.paused = false;

        this.blockGravity = 800;
        this.blockSpeed = 100;
        this.upgrades = 0;
        this.collectableRate = 95;
        this.playerSpeed = 5;
        this.playerHealth = 100;
        this.timerResetPoint = 800;

        //adding blocks
        this.blocks = game.add.group();
        this.coins = game.add.group();

        //background and physics engine
        game.stage.backgroundColor = '#71c5cf';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // adding player and Initializing physics
        this.player = game.add.sprite(170, 350, 'player');
        game.physics.arcade.enable(this.player);

        //game loop itself

          this.timer = game.time.events.loop(1000, this.addBlock, this);



    },

    removeCoin: function(coin) {
        coin.destroy();
    },
    collectCoin: function(player, coin) {
        coin.destroy();
        this.upgrades += 1;
        this.labelUpgrades.text = 'Upgrade Points: ' + this.upgrades;
    },
    removeBlock: function(block) {
        //remove block an increase score
        block.destroy();

        if(!this.paused){
          this.score += 1;
        }

        this.labelScore.text = 'Score: ' + this.score;

        // allows an increase in speed every 5 points
        var nextLevel = false;
        if (this.score % 5 === 0) {
            nextLevel = true;
        } else {
            nextLevel = false;
        }


        if (nextLevel) {
            if (this.timer.delay > this.timerResetPoint) {
                this.blockGravity += 25;
                this.blockSpeed += 50;
                this.timer.delay -= 50;
            } else {
                //reset game loop to origin speed however speed of blocks falling remains the same.
                if (this.timerResetPoint > 0) {
                    this.timer.delay += 150;
                    this.timerResetPoint -= 100;
                } else {
                    //reset things to a manageable point when it gets impossible.
                    this.timer.delay = 800;
                    this.timerResetPoint = 500;
                }
            }
        } else {
            var stats = {
                'Loop Delay: ': this.timer.delay,
                'Block Gravity: ': this.blockGravity,
                'Reset Point: ': this.timerResetPoint,
                'Block Speed: ': this.blockSpeed,
                'Player Speed: ': this.playerSpeed
            };
            // console.log(stats);
        }

    },

    addBlock: function() {
        //random number to check if coin should spawn
        var collectable = Math.floor(Math.random() * 100) + 1;

        //picks a random point on the x axis.
        var rand = Math.floor(Math.random() * 399) + 1;

        if (collectable > this.collectableRate) {
            this.coin = game.add.sprite(rand, 0, 'coin');
            //adds sprite to group.
            this.coins.add(this.coin);

            //enable physics
            game.physics.arcade.enable(this.coin);
            this.coin.body.gravity.y = this.blockGravity;
            this.coin.body.velocity.y = this.blockSpeed;
            //event checking world bounds of block and removes them.
            this.coin.checkWorldBounds = true;
            this.coin.events.onOutOfBounds.add(this.removeCoin, this);
        } else {

            this.block = game.add.sprite(rand, 0, 'block');
            //adds sprite to group.
            this.blocks.add(this.block);

            //enable physics
            game.physics.arcade.enable(this.block);
            this.block.body.gravity.y = this.blockGravity;
            this.block.body.velocity.y = this.blockSpeed;
            //event checking world bounds of block and removes them.
            this.block.checkWorldBounds = true;
            this.block.events.onOutOfBounds.add(this.removeBlock, this);
        }
    },

    restartGame: function() {
        // Start the 'main' state, which restarts the game
        if (this.playerHealth > 1) {
            this.playerHealth -= 1;
            this.labelHealth.text = 'Health: ' + this.playerHealth;
        } else {
            this.labelHealth.text = 'Health: ' + this.playerHealth;
            game.state.start('main');
        }
    },

    update: function() {
      if(this.paused){
        this.labelScore.text = '';
        this.labelPaused.text = 'Paused';
        this.labelHealth.text = '';
        this.labelUpgrades.text = '';
      } else {
        this.labelPaused.text = '';
        this.labelUpgrades.text = 'Upgrade Points: ' + this.upgrades;
        this.labelHealth.text = 'Health: ' + this.playerHealth;
        this.labelScore.text = 'Score: ' + this.score;


        //keyboard mapping
        var upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        var downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        var leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        var rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

        var altUpKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        var altDownKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        var altLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        var altRightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

        //left
        if (leftKey.isDown || altLeftKey.isDown && this.player.x > 0) {
          console.log('left: ',this.player.x ) ;
            this.player.x -= this.playerSpeed;
        } else if (leftKey.isDown && this.player.x < 0) {
          console.log('left border');
            this.player.x = 400;
        }
        //right
        if (rightKey.isDown || altRightKey.isDown && this.player.x < 400) {
            this.player.x += this.playerSpeed;
        } else if (rightKey.isDown && this.player.x > 0) {
            this.player.x = 0;
        }
        //up
        if (upKey.isDown || altUpKey.isDown && this.player.y > 15) {
            this.player.y -= this.playerSpeed;
        }
        //down
        if (downKey.isDown || altDownKey.isDown && this.player.y < 425) {
            this.player.y += this.playerSpeed;
        }
        //

        //game over collision
        game.physics.arcade.overlap(
            this.player, this.coins, this.collectCoin, null, this);

        game.physics.arcade.overlap(
            this.player, this.blocks, this.restartGame, null, this);
          }


    },
};

// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
