/*
* main.js
*/
var canvas;
var stage;
var bg;
var stars;
var commet;
var shootingStarCounter = 0;
var moon;

function init() {
	// resize event listener
	window.addEventListener('resize', resize, false);

	// create a new stage and point it at our canvas:
	canvas = document.getElementById('canvas');
	stage = new createjs.Stage(canvas);

	spawnSceneElements();
	
	resize();

	loadSound();

	/*
	* Ticker
	*/
	createjs.Ticker.setFPS(120);
	createjs.Ticker.addEventListener('tick', tick);
}

function spawnSceneElements() {
	createBackground();
	createStars();
	createCommet();
	createMoon();
	createFPS();
}

function createBackground() {
	bg = new createjs.Shape();
	stage.addChild(bg);
}

function updateBackground() {
	bg.graphics.beginLinearGradientFill(['#000', 'rgb(15, 20, 80)'], [0, 1], 0, 0, 0, canvas.height).drawRect(0, 0, canvas.width, canvas.height);
}

function createStars() {
	stars = new createjs.Shape();
	stage.addChild(stars);

	stars.snapToPixel = true;
}

function updateStars() {
	stars.graphics.clear();

	for (var i = 0; i < 30000; i++) {
		var x = Math.floor((Math.random() * canvas.width) + 0);
		var y = Math.floor((Math.random() * canvas.height) + 0);
		var radius = (Math.random() * 0.7) + 0.1;

		stars.graphics.beginFill('white').drawCircle(x, y, radius);
	};

	var colors = ['#9bb0ff', '#aabfff', '#cad7ff', 'ffffff', '#fef4ea', '#fed1a3', '#fdc975'];

	for (var i = 0; i < 2000; i++) {
		var x = Math.floor((Math.random() * canvas.width) + 0);
		var y = Math.floor((Math.random() * canvas.height) + 0);
		var radius = (Math.random() * 1.3) + 0.5;

		stars.graphics.beginFill(colors[Math.random() * colors.length | 0]).drawCircle(x, y, radius);
	};

	stars.cache(0, 0, canvas.width, canvas.height);
}

function createCommet() {
	commet = new createjs.Shape();
	commet.graphics.beginFill('rgb(180, 220, 250)').drawCircle(0, 0, 2);
	stage.addChild(commet);
}

function updateCommet(event) {
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
}

function createMoon() {
	moon = new createjs.Bitmap('assets/moon.png');
	moon.x = 200;
	moon.y = 100;
	stage.addChild(moon);

	createjs.Tween.get(moon)
	.to({x: moon.x + canvas.width, y: moon.y + 50}, 500000);
}

function updateMoon() {
	moon.scaleX = moon.scaleY = canvas.width / 1300.0;
}

function createFPS() {
	// add a text object to output the current FPS:
	fpsLabel = new createjs.Text('-- fps', 'bold 18px Arial', '#fff');
	fpsLabel.x = 10;
	fpsLabel.y = 10;
	stage.addChild(fpsLabel);
}

function updateFPS() {
	fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + ' fps';
}

function tick(event) {
	updateCommet(event);
	
	updateFPS();

	//console.log('total time: ' + createjs.Ticker.getTime());

	// draw the updates to stage:
	stage.update(event);
}

function resize() { 
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	updateBackground();
	updateStars();
	updateMoon();
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
