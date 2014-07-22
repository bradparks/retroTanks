/* global Meteor: true */
var gs = Meteor.gameSpace || {};

if (Meteor.isClient) {
	Template.hello.greeting = function () {
		return "Welcome to retroTanks.";
	};

	Template.hello.rendered = function () {

		Session.set("sessionId", Meteor.uuid());

		tank = new gs.Tank();
		tank.userId = Session.get("sessionId");
		myTank = tank;
		myTank.x = 25;
		myTank.y = 200;

		var tankCount = gs.tankService.getAll().length;

		if (tankCount == 1) {
			tank.fillStyle = 'rgb(0,255,0);'
		} else if (tankCount == 2) {
			tank.fillStyle = 'rgb(0,0,255);'
		} else if (tankCount == 3) {
			tank.fillStyle = 'rgb(100,100,100);'
		}

		console.log(tankCount);
		console.log(tank.fillStyle);

		myTank._id = gs.tankService.add(tank);

		//run game loop at ~30 FPS
		//var gameLoop =
		//setInterval(function () {
		//gs.frame.sync(scene, context, Tanks, Bullets);
		//}, 33);

		function keyup_handler(event) {
			var myTank = gs.tankService.getMyTank();
			/*
			if (event.keyCode == 87 || event.keyCode == 83) {
				myTank.stop();
				Tanks.update({
					_id: gs.myDoc
				}, {
					$set: {
						x: myTank.x,
						y: myTank.y,
						angle: myTank.angle,
						mod: myTank.mod
					}
				});
			}*/

			if (event.keyCode === 32 || event.keyCode === 13) { //space, enter
				if (myTank && !myTank.isDamaged()) {
					var bullet = new gs.Bullet();
					bullet.x = myTank.x + (myTank.width * 0.5);
					bullet.y = myTank.y + (myTank.height * 0.5);
					bullet.angle = myTank.angle;
					bullet.userId = Session.get('sessionId');
					bullet.mod = myTank.mod;
					gs.bulletService.add(bullet);
				}
			}
		}

		function keypress_handler(event) {
			var myTank = gs.tankService.getMyTank();
			if (myTank && !myTank.isDamaged()) {
				if (event.keyCode === 87 || event.keyCode === 38) { //W, up
					myTank.moveForward(gs.scene.walls);
					gs.tankService.updateLocation(myTank);
				}
				if (event.keyCode === 83 || event.keyCode === 40) { //S, down
					myTank.moveBack(gs.scene.walls);
					gs.tankService.updateLocation(myTank);
				}
				if (event.keyCode === 65 || event.keyCode === 37) { //A, left
					myTank.rotateLeft();
					gs.tankService.updateLocation(myTank);
				}
				if (event.keyCode === 68 || event.keyCode === 39) { //D, right
					myTank.rotateRight();
					gs.tankService.updateLocation(myTank);
				}
			}
		}

		window.addEventListener("keydown", keypress_handler, false);
		window.addEventListener("keyup", keyup_handler, false);
	}
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}