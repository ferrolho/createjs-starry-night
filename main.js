/*
* main.js
*/
var canvas;
var stage;
var commet;

function init() {
	// resize event listener
	window.addEventListener('resize', resize, false);

	// create a new stage and point it at our canvas:
	canvas = document.getElementById('canvas');
	stage = new createjs.Stage(canvas);

	resize();

	loadSound();

	var bg = new createjs.Shape();
	bg.graphics.beginLinearGradientFill(['#000', 'rgb(15, 20, 80)'], [0, 1], 0, 0, 0, canvas.height).drawRect(0, 0, canvas.width, canvas.height);
	stage.addChild(bg);

	spawnStars();

	// commets
	commet = new createjs.Shape();
	commet.graphics.beginFill('rgb(180, 220, 250)').drawCircle(0, 0, 2);
	stage.addChild(commet);

	spawnMoon();
	
	// add a text object to output the current FPS:
	fpsLabel = new createjs.Text('-- fps', 'bold 18px Arial', '#fff');
	fpsLabel.x = 10;
	fpsLabel.y = 10;
	stage.addChild(fpsLabel);

	/*
	* Ticker
	*/
	createjs.Ticker.setFPS(120);
	createjs.Ticker.addEventListener('tick', tick);
}

function spawnStars() {
	var colors = ['#9bb0ff', '#aabfff', '#cad7ff', 'ffffff', '#fef4ea', '#fed1a3', '#fdc975'];

	var stars = new createjs.Shape();

	for (var i = 0; i < 30000; i++) {
		var x = Math.floor((Math.random() * canvas.width) + 0);
		var y = Math.floor((Math.random() * canvas.height) + 0);
		var radius = (Math.random() * 0.7) + 0.1;

		stars.graphics.beginFill('white').drawCircle(x, y, radius);
	};

	for (var i = 0; i < 2000; i++) {
		var x = Math.floor((Math.random() * canvas.width) + 0);
		var y = Math.floor((Math.random() * canvas.height) + 0);
		var radius = (Math.random() * 1.3) + 0.5;

		stars.graphics.beginFill(colors[Math.random() * colors.length | 0]).drawCircle(x, y, radius);
	};

	stars.cache(0, 0, canvas.width, canvas.height);
	stars.snapToPixel = true;

	stage.addChild(stars);
}

function spawnMoon() {
	var moon = new createjs.Bitmap('assets/moon.png');
	moon.x = 200;
	moon.y = 100;
	moon.scaleX = moon.scaleY = 0.99;
	stage.addChild(moon);

	createjs.Tween.get(moon)
	.to({x: moon.x + canvas.width, y: moon.y + 50}, 500000);
}

var shootingStarCounter = 0;

function tick(event) {
	shootingStarCounter += event.delta;

	if (shootingStarCounter > 2500) {
		commet.x = Math.floor((Math.random() * canvas.width / 3) + 0);
		commet.y = Math.floor((Math.random() * canvas.height / 2) + 0);

		createjs.Tween.get(commet)
		.to({alpha: 0})
		.to({alpha: 1, x: commet.x + 600, y: commet.y + 100}, 500, createjs.Ease.getPowInOut(2))
		.to({alpha: 0});

		shootingStarCounter = 0;
	}

	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + ' fps';

	//console.log('total time: ' + createjs.Ticker.getTime());

	// draw the updates to stage:
	stage.update(event);
}

function resize() { 
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function loadSound() {
	// if initializeDefaultPlugins returns false, we cannot play sound in this browser
	if (!createjs.Sound.initializeDefaultPlugins()) {
		console.log('No sound!');
		return;
	}

	var audioPath = 'assets/';
	var sounds = [
	{ id: 'music', src: 'Hans Zimmer - S.T.A.Y..ogg' },
	{ id: 'thunder', src: 'thunder.ogg' }
	];

	createjs.Sound.alternateExtensions = ['mp3'];
	createjs.Sound.addEventListener('fileload', handleLoad);
	createjs.Sound.registerSounds(sounds, audioPath);
}

function handleLoad(event) {
	if (event.id === 'music')
		createjs.Sound.play(event.id);
}
