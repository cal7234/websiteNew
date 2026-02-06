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

	var GOLD_MAX = 6; // max number of gold pieces
	var GOLD_VALUE = 10; // value of each gold piece

	// The following variables are grab-related,
	// so they start with 'grab'

	var grab_x; // current x-pos of grabber
	var grab_y; // current y-pos of grabber

	var score = 0; // current score
	var gold_count = 0; // number of pieces grabbed

	var RAINBOW = [
		PS.COLOR_RED,
		PS.COLOR_ORANGE,
		PS.COLOR_YELLOW,
		PS.COLOR_GREEN,
		PS.COLOR_BLUE,
		PS.COLOR_VIOLET
	];

	var next_color = 0; // index into RAINBOW
	// 15 x 15 map array
	// 0 = wall, 1 = floor

	var map = [
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

		for ( i = 0; i < GOLD_MAX; i += 1 ) {
			var color_index = i % RAINBOW.length;
			var pos = find_floor( 2, RAINBOW[ color_index ] );

			// Store which rainbow color this bead is
			PS.data( pos.x, pos.y, color_index );
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

			draw_map();

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
			if ( data === 0 ) {
				return;
			}

			if ( data === 2 ) {
				var bead_color = PS.data(nx, ny);

				if ( bead_color !== next_color ) {
					PS.audioPlay( "fx_click" );
					resetGame();
					return;
				}

				// Correct color
				map[loc] = 1;
				PS.data(nx, ny, null);
				score += GOLD_VALUE;
				gold_count += 1;
				next_color += 1;

				// Loop back to red after violet
				if (next_color >= RAINBOW.length) {
					next_color = 0;
				}
				if ( gold_count >= GOLD_MAX ) {
					game_over = true;
					PS.statusText( "You Win!" );
					PS.audioPlay( "fx_tada" );
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