// The global G variable creates a namespace
// for game-specific code and variables

// It is initialized with an immediately-invoked
// function call (described below)

var G = ( function () {
	// By convention, constants are all upper-case

	var WIDTH = 15; // width of grid
	var HEIGHT = 15; // height of grid

	var COLOR_GRAB = PS.COLOR_GREEN; // grabber color
	var COLOR_FLOOR = PS.COLOR_WHITE; // floor color
	var COLOR_WALL = PS.COLOR_BLACK; // wall color
	var COLOR_GOLD = PS.COLOR_YELLOW; // gold color

	var gold_target = 0; // max number of gold pieces
	var GOLD_VALUE = 10; // value of each gold piece

	// The following variables are grab-related,
	// so they start with 'grab'

	var grab_x; // current x-pos of grabber
	var grab_y; // current y-pos of grabber
//lvl 3 vars
	var sequence = [];
	var player_index = 0;
	var memory_round = 0;
	var showing_sequence = false;
	var memory_timer = null;

	var CENTER_X = 7;
	var CENTER_Y = 7;

	var score = 0; // current score
	var gold_count = 0; // number of pieces grabbed
	var level = 0; // current level index
	var RAINBOW = [
		PS.COLOR_RED,
		PS.COLOR_ORANGE,
		PS.COLOR_YELLOW,
		PS.COLOR_GREEN,
		PS.COLOR_BLUE,
		PS.COLOR_VIOLET
	];

	var movers = [];
	var mover_timer = null;
	var target_color = null;
	var dodge_round = 0;
	var dodge_speed = 20;

	var next_color = 0; // index into RAINBOW
	// 15 x 15 map array
	// 0 = wall, 1 = floor
	var levelTitles = [
		"ROYGBIV",              // Level 1 title
		"RED+BLUE=?",
		"MEMORY",
		"Dodge"
		// Level 2 title
	];
	var maps = [
		[
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		],
		//LEVEL 2
		[
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1,
			1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
			1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
			1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1,
			1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
			1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
			1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
			1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0,
			1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1],

		[
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
		],
		[
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
		]
	];

	// Fixed gold positions for levels that need them
// x, y, colorIndex (0=red, 1=orange, etc.)
	var levelGold = [
		null, // Level 1 = random

		// ===== LEVEL 2 =====
		[

			{ x: 14,  y: 4,  c: 1 }, // orange
			{ x: 8, y: 4,  c: 4 }, // blue
			{ x: 12, y: 6,  c: 5 }  // violet
		]
	];
	var placeFixedGold = function (goldArray) {
		var i, g, loc;

		for (i = 0; i < goldArray.length; i += 1) {
			g = goldArray[i];
			loc = (g.y * WIDTH) + g.x;

			map[loc] = 2; // gold
			PS.color(g.x, g.y, RAINBOW[g.c]);
			PS.data(g.x, g.y, g.c); // store color index
		}
	};
//LVL 3 FUNCS
	var setupSequenceLevel = function () {

		sequence = [];
		player_index = 0;
		memory_round = 0;

		PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
		PS.statusText("Watch carefully...");

		nextRound();
	};

	var nextRound = function () {

		player_index = 0;
		memory_round += 1;

		sequence.push(PS.random(RAINBOW.length) - 1);

		showSequence();
	};

	var showSequence = function () {

		var i = 0;
		showing_sequence = true;

		memory_timer = PS.timerStart(30, function () {

			// turn off previous flash
			if (i > 0) {
				PS.color(CENTER_X, CENTER_Y, PS.COLOR_BLACK);
			}

			// finished showing sequence?
			if (i >= sequence.length) {
				PS.timerStop(memory_timer);
				showing_sequence = false;
				drawColorRow();
				PS.statusText("Repeat the sequence");
				return;
			}

			// flash next color
			PS.color(CENTER_X, CENTER_Y, RAINBOW[sequence[i]]);
			i += 1;

		});
	};

	var drawColorRow = function () {

		var i;
		var startX = 4; // where row begins
		var y = 12;

		for (i = 0; i < RAINBOW.length; i += 1) {
			PS.color(startX + i, y, RAINBOW[i]);
			PS.data(startX + i, y, i);
		}
	};
	var flashColor = function (color_index, on) {
		var x = 4 + (color_index % 3) * 3;
		var y = 5 + Math.floor(color_index / 3) * 3;

		if (on) {
			PS.color(x, y, PS.COLOR_WHITE);
		}
		else {
			PS.color(x, y, RAINBOW[color_index]);
		}
	};
	PS.touch = function (x, y) {
		if (level === 3) { // Level 4 is index 3

			var hit_color = PS.data(x, y);

			if (hit_color !== undefined) {

				if (hit_color === target_color) {
					PS.audioPlay("fx_tada");

					if (dodge_round >= 5) { // completed all rounds
						PS.statusText("You Beat The Game!");
						PS.timerStop(mover_timer);
						return;
					}

					dodge_speed = Math.max(5, dodge_speed - 3); // speed up
					startDodgeRound();
					return;
				}
				else {
					PS.audioPlay("fx_click");
					setupDodgeLevel(); // restart round
					return;
				}
			}
		}
		if (level !== 2 || showing_sequence) {
			return;
		}

		var color_index = PS.data(x, y);

		if (color_index === undefined) {
			return;
		}

		// Correct click
		if (color_index === sequence[player_index]) {

			player_index += 1;

			if (player_index >= sequence.length) {
				if (memory_round >= 5) {
					PS.audioPlay("fx_tada");
					level += 1;

					if (level < maps.length) {
						loadLevel(level);
					}
					else {
						PS.statusText("You Beat All Levels!");
					}

					return;
				}

				PS.audioPlay("fx_coin7");

				// clear row
				PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);

				nextRound();
			}
		}
		else {
			PS.audioPlay("fx_click");
			PS.statusText("Wrong! Restarting...");
			setupSequenceLevel();
		}
	};
//LVL 4

	// ------------------- LEVEL 4 (DODGE) -------------------

	var setupDodgeLevel = function () {

		PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
		PS.statusText("Reach the GREEN dot!");

		movers = [];
		dodge_round = 0;
		dodge_speed = 20;

		// PLACE PLAYER IN CENTER
		grab_x = 7;
		grab_y = 7;
		PS.color(grab_x, grab_y, COLOR_GRAB);

		startDodgeRound();
	};

	var startDodgeRound = function () {

		dodge_round += 1;
		movers = [];

		target_color = PS.COLOR_GREEN;

		// create 5 moving dots
		for (var i = 0; i < 5; i += 1) {

			var x = PS.random(13) + 1; // avoid edges
			var y = PS.random(13) + 1;

			var color = (i === 0) ? target_color : RAINBOW[PS.random(RAINBOW.length) - 1];

			movers.push({
				x: x,
				y: y,
				color: color
			});

			PS.color(x, y, color);
			PS.data(x, y, color); // store the color constant
		}

		// redraw player on top
		PS.color(grab_x, grab_y, COLOR_GRAB);

		startMoverTimer();
	};

	var startMoverTimer = function () {

		if (mover_timer) {
			PS.timerStop(mover_timer);
		}

		mover_timer = PS.timerStart(dodge_speed, function () {

			// clear old mover positions
			for (var i = 0; i < movers.length; i += 1) {
				var m = movers[i];
				PS.color(m.x, m.y, PS.COLOR_BLACK);
				PS.data(m.x, m.y, null);
			}

			// move movers randomly
			for (var i = 0; i < movers.length; i += 1) {
				var m = movers[i];
				m.x += PS.random(3) - 2;
				m.y += PS.random(3) - 2;

				if (m.x < 1) m.x = 1;
				if (m.x > 13) m.x = 13;
				if (m.y < 1) m.y = 1;
				if (m.y > 13) m.y = 13;
			}

			// redraw movers
			for (var i = 0; i < movers.length; i += 1) {
				var m = movers[i];
				PS.color(m.x, m.y, m.color);
				PS.data(m.x, m.y, m.color);
			}

			// redraw player on top
			PS.color(grab_x, grab_y, COLOR_GRAB);
		});
	};




//----------------------------------------------------------------------------
	var resetGame = function () {
		// Reset state
		score = 0;
		gold_count = 0;
		next_color = 0;
		game_over = false;

		// Reset map to original layout
		map = [
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		// Clear grid and redraw
		PS.color( PS.ALL, PS.ALL, COLOR_FLOOR );
		draw_map();

		PS.statusText( "Try Again-ROYGBIV" );
	};
	var loadLevel = function (lvl) {
		score = 0;
		gold_count = 0;
		next_color = 0;
		game_over = false;

		map = maps[lvl].slice();

		PS.color(PS.ALL, PS.ALL, COLOR_FLOOR);

		// Set gold target
		if (levelGold[lvl]) {
			gold_target = levelGold[lvl].length;
		}
		else {
			gold_target = RAINBOW.length; // 6 colors for Level 1
		}

		draw_map();
		if (level === 2) {
			setupSequenceLevel();
			return;
		}
		if (level === 3) {
			setupDodgeLevel();
			return;
		}
		PS.statusText(levelTitles[lvl]);
	};
	// This function finds a random floor
	// location on the map (the value 1)
	// and places an item there, returning the
	// x/y position of each placed object.
	// It's used to place the gold pieces
	// and the grabber.

	var find_floor = function ( item, color ) {
		var xpos, ypos, loc, data;

		do {
			xpos = PS.random( WIDTH ) - 1;
			ypos = PS.random( HEIGHT ) - 1;
			loc = ( ypos * WIDTH ) + xpos;
			data = map[ loc ]; // get map data
		} while ( data !== 1 ); // try again

		map[ loc ] = item; // place item
		PS.color( xpos, ypos, color ); // set color
		return { x : xpos, y : ypos }; // return x/y
	};

	// Draw layout based on map array

	var draw_map = function () {
		var x, y, data, i, pos;
		if (level === 3) {
			return;
		}
		for ( y = 0; y < HEIGHT; y += 1 ) {
			for ( x = 0; x < WIDTH; x += 1 ) {
				data = map [ ( y * WIDTH ) + x ];
				if ( data === 0 ) {
					PS.color( x, y, COLOR_WALL );
				}
			}
		}

		// Randomly place gold pieces on map.
		// No need to record their x/y positions.

		if ( levelGold[level] ) {
			// Fixed gold for this level
			placeFixedGold(levelGold[level]);
		}
		else {
			// Random gold (Level 1)
			for ( i = 0; i < RAINBOW.length; i += 1 ) {
				var color_index = i % RAINBOW.length;
				var pos = find_floor( 2, RAINBOW[ color_index ] );
				PS.data( pos.x, pos.y, color_index );
			}
		}

		// Randomly place grabber on floor
		// and save its x/y position

		pos = find_floor( 3, COLOR_GRAB );
		grab_x = pos.x;
		grab_y = pos.y;
	};

	// The 'exports' object is used to define
	// variables and/or functions that need to be
	// accessible outside this function.

	var exports = {

		// G.init()
		// Initializes the game

		init : function () {
			PS.gridSize( WIDTH, HEIGHT ); // init grid
			PS.color( PS.ALL, PS.ALL, COLOR_FLOOR );
			PS.border( PS.ALL, PS.ALL, 0 ); // no borders

			level = 0;
			loadLevel(level);

			// Preload sound effects

			PS.audioLoad( "fx_click" );
			PS.audioLoad( "fx_coin7" );
			PS.audioLoad( "fx_tada" );

			PS.statusText( "ROYGBIV" );
		},

		// G.move( h, v )
		// Moves the grabber around the map
		// h : integer = horizontal movement
		// v : integer = vertical movement
		// h = 0: No horizontal movement
		// h = 1: Move one bead to the right
		// h = -1: Move one bead to the left
		// v = 0: No vertical movement
		// v = 1: Move one bead down
		// v = -1: Move one bead up

		move : function ( h, v ) {
			var nx, ny;

			// Calculate proposed new location.

			nx = grab_x + h;
			ny = grab_y + v;

			// Is new location off the grid?
			// If so, exit without moving.

			if ( ( nx < 0 ) || ( nx >= WIDTH ) ||
				( ny < 0 ) || ( ny >= HEIGHT ) ) {
				return;
			}

			// Is there a wall in the proposed location?
			// If the array data there = 0,
			// exit without moving.
			// If data = 2, it's gold, so update score.

			loc = ( ny * WIDTH ) + nx;
			data = map[ loc ];

			if (level === 3) {

				var hit_color = PS.data(nx, ny);

				if (hit_color !== undefined) {

					if (hit_color === target_color) {

						PS.audioPlay("fx_tada");

						dodge_round += 1;

						if (dodge_round >= 5) {
							level += 1;
							loadLevel(level);
							return;
						}

						dodge_speed -= 3;
						startDodgeRound();
						return;
					}
					else {
						PS.audioPlay("fx_click");
						setupDodgeLevel();
						return;
					}
				}
			}
			if ( data === 0 ) {
				return;
			}

			if ( data === 2 ) {

				var bead_color = PS.data(nx, ny);

				// ===== LEVEL 2 SPECIAL RULE =====
				if ( level === 1 ) {

					if ( bead_color === 5 ) { // purple
						PS.audioPlay("fx_tada");
						PS.statusText("You Win!");
						level += 1;

						if (level < maps.length) {
							loadLevel(level);
						}
						return;
					}
					else {
						PS.audioPlay("fx_click");
						loadLevel(level); // reset current level
						return;
					}
				}

				// ===== NORMAL LEVEL LOGIC (Level 1) =====
				if ( bead_color !== next_color ) {
					PS.audioPlay( "fx_click" );
					loadLevel(level);
					return;
				}

				map[loc] = 1;
				PS.data(nx, ny, null);
				score += GOLD_VALUE;
				gold_count += 1;
				next_color += 1;

				if (next_color >= RAINBOW.length) {
					next_color = 0;
				}

				if ( gold_count >= gold_target ) {
					PS.audioPlay("fx_tada");
					level += 1;

					if ( level >= maps.length ) {
						PS.statusText("You beat all levels!");
					} else {
						loadLevel(level);
					}
					return;
				}
			}

			// Legal move, so change current grabber
			// location to floor color.

			PS.color( grab_x, grab_y, COLOR_FLOOR );

			// Assign grabber's color to the
			// new location.

			PS.color ( nx, ny, COLOR_GRAB );

			// Finally, update grabber's position

			grab_x = nx;
			grab_y = ny;
		}
	};

	return exports;
} () );
// Tell Perlenspiel to use our G.init() function
// to initialize the game

PS.init = G.init;

PS.keyDown = function( key, shift, ctrl, options ) {
	switch ( key ) {
		case PS.KEY_ARROW_UP:
		case 119:
		case 87: {
			G.move( 0, -1 ); // move UP (v = -1)
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83: {
			G.move( 0, 1 ); // move DOWN (v = 1)
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65: {
			G.move( -1, 0 ); // move LEFT (h = -1)
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68: {
			G.move( 1, 0 ); // move RIGHT (h = 1)
			break;
		}
	}
};