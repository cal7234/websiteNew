"use strict";

/* GRID */
var GRID_SIZE = 32;

/* COLORS */
var RAINBOW = [
    PS.COLOR_RED,
    PS.COLOR_ORANGE,
    PS.COLOR_YELLOW,
    PS.COLOR_GREEN,
    PS.COLOR_BLUE
];

/* MEMORY VARIABLES */
var sequence = [];
var player_index = 0;
var memory_round = 0;
var showing_sequence = false;
var memory_timer;

/* PLAYER */
var playerSprite;
var playerX = 8;
var playerY = 14;

/* CUSTOMER */
var customerSprite;
var customerX = 8;
var customerY = -1;
var serve_ready = false;

/* CHAT BUBBLE */
var bubbleSprite;
var bubbleX = 22;
var bubbleY = 3;

/* SEQUENCE SPRITES */
var sequenceSprites = [];

/* SCORE */
var score = 0;

/* PLAYER IMAGE LOADER */
var playerLoader = function(image) {
    playerSprite = PS.spriteImage(image);
    PS.spritePlane(playerSprite, 5);
    PS.spriteMove(playerSprite, playerX, playerY);
};

/* CHAT BUBBLE IMAGE LOADER */
var bubbleLoader = function(image) {
    bubbleSprite = PS.spriteImage(image);
    PS.spritePlane(bubbleSprite, 2); // above background, below characters
    PS.spriteMove(bubbleSprite, bubbleX, bubbleY);
};

/* SETUP LEVEL */
var setupSequenceLevel = function() {

    sequence = [];
    player_index = 0;
    memory_round = 0;
    serve_ready = false;

    PS.gridSize(GRID_SIZE, GRID_SIZE);
    PS.border(PS.ALL, PS.ALL, 0);
    PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);

    /* BACKGROUND */
    PS.imageLoad("background.png", function(image) {
        PS.imageBlit(image, 0, 0);
    });

    createSprites();

    PS.statusText("Score: " + score + " | Watch the order...");

    nextRound();
};

/* CREATE SPRITES */
var createSprites = function() {

    /* PLAYER IMAGE SPRITE */
    PS.imageLoad("player.png", playerLoader);

    /* CHAT BUBBLE SPRITE */
    PS.imageLoad("bubble.png", bubbleLoader);

    /* CUSTOMER SPRITE */
    PS.imageLoad("cat.png", function(image) {
        customerSprite = PS.spriteImage(image);
        PS.spritePlane(customerSprite, 5);
        PS.spriteMove(customerSprite, customerX, customerY);
    });
};

/* START NEXT ROUND */
var nextRound = function() {

    player_index = 0;
    serve_ready = false;

    sequence = [];
    memory_round += 1;

    var i;
    for (i = 0; i < memory_round + 2; i += 1) {
        sequence.push(PS.random(RAINBOW.length) - 1);
    }

    showSequence();
};

/* SHOW ORDER AS SPRITES INSIDE BUBBLE */
var showSequence = function() {

    // Clear old sequence sprites
    for (var s = 0; s < sequenceSprites.length; s++) {
        PS.spriteDelete(sequenceSprites[s]);
    }
    sequenceSprites = [];

    showing_sequence = true;
    var i = 0;

    memory_timer = PS.timerStart(30, function() {

        if (i >= sequence.length) {
            PS.timerStop(memory_timer);
            showing_sequence = false;

            // Keep the sprites visible for a short duration, then delete
            PS.timerStart(60, function() {
                for (var s = 0; s < sequenceSprites.length; s++) {
                    PS.spriteDelete(sequenceSprites[s]);
                }
                sequenceSprites = [];
            });

            drawFoodRow();
            PS.statusText("Score: " + score + " | Make the order!");
            return;
        }

        // Create a small 1x1 sprite for the color
        var sprite = PS.spriteSolid(1,1);
        PS.spriteSolidColor(sprite, RAINBOW[sequence[i]]);
        PS.spritePlane(sprite, 3); // above bubble (plane 2), below characters
        PS.spriteMove(sprite, bubbleX + i, bubbleY);

        sequenceSprites.push(sprite);
        i += 1;
    });
};

/* DRAW FOOD ROW */
var drawFoodRow = function() {
    var startX = 5;
    var y = 30;
    var i;
    for (i = 0; i < RAINBOW.length; i += 1) {
        PS.color(startX + i, y, RAINBOW[i]);
        PS.data(startX + i, y, i);
    }
};

/* CHECK PLAYER DISTANCE */
var checkDistance = function(x, y) {
    var dx = Math.abs(playerX - x);
    var dy = Math.abs(playerY - y);
    return (dx <= 8 && dy <= 8); // increased for 8x8 sprite
};

/* INIT */
PS.init = function() {
    setupSequenceLevel();
};

/* PLAYER MOVEMENT */
PS.keyDown = function(key) {
    if (showing_sequence) { return; }

    if (key === PS.KEY_ARROW_UP) { playerY -= 1; }
    else if (key === PS.KEY_ARROW_DOWN) { playerY += 1; }
    else if (key === PS.KEY_ARROW_LEFT) { playerX -= 1; }
    else if (key === PS.KEY_ARROW_RIGHT) { playerX += 1; }

    playerX = Math.max(0, Math.min(GRID_SIZE - 1, playerX));
    playerY = Math.max(0, Math.min(GRID_SIZE - 1, playerY));

    PS.spriteMove(playerSprite, playerX, playerY);
};

/* CLICK EVENTS */
PS.touch = function(x, y) {

    if (showing_sequence) { return; }

    /* SERVE CUSTOMER */
    if (x === customerX && y === customerY) {
        if (serve_ready) {
            PS.audioPlay("fx_tada");
            PS.statusText("Score: " + score + " | Order served!");
            nextRound();
        } else {
            PS.statusText("Score: " + score + " | Finish the order first!");
        }
        return;
    }

    /* CHECK FOOD TILE */
    var color_index = PS.data(x, y);
    if (color_index === undefined) { return; }
    if (!checkDistance(x, y)) {
        PS.statusText("Score: " + score + " | Move closer!");
        return;
    }

    /* CORRECT FOOD */
    if (color_index === sequence[player_index]) {
        player_index += 1;
        PS.audioPlay("fx_coin7");
        if (player_index >= sequence.length) {
            serve_ready = true;
            score += 1; // increment score only when sequence is completed
            PS.statusText("Score: " + score + " | Click the customer to serve!");
        }
    } else {
        PS.audioPlay("fx_click");
        PS.statusText("Score: " + score + " | Wrong order! Restarting...");
        score = 0; // reset score only when player messes up
        setupSequenceLevel();
    }
};