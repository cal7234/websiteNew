"use strict";

/* Store all dots */
var dots = [];

/* Create random dots */
var makeDots = function () {

	/* Clear grid */
	PS.color(PS.ALL, PS.ALL, PS.COLOR_BLACK);
	PS.radius(PS.ALL, PS.ALL, 0);
	PS.scale(PS.ALL, PS.ALL, 100);
	PS.border(PS.ALL, PS.ALL, 0);

	dots = [];

	/* Random number of dots */
	var count = PS.random(10);

	for (var i = 0; i < count; i += 1) {

		var x = PS.random(16) - 1;
		var y = PS.random(16) - 1;

		var size = PS.random(100);

		var color = PS.makeRGB(
			PS.random(255),
			PS.random(255),
			PS.random(255)
		);

		var radius = (PS.random(2) === 1) ? 0 : 50;

		PS.color(x, y, color);
		PS.scale(x, y, size);
		PS.radius(x, y, radius);

		dots.push({ x: x, y: y });
	}
};

/* Initialize */
PS.init = function () {
	PS.gridSize(16, 16);
	makeDots();
};

/* Click */
PS.touch = function (x, y) {

	for (var i = 0; i < dots.length; i += 1) {
		if (dots[i].x === x && dots[i].y === y) {
			makeDots();
			return;
		}
	}
};