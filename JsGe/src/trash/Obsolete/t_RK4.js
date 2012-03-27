var GeTest = Class.create({
	initialize: function(name) {
		this.name = name;
		this.log = new GeLog("GameLog");
		this.run();
	},
	run: function() {
		this.log.w("No test written for " + this.name + " test");
	}
});

var GeTest_RK4Integrator = new Class.create(GeTest, {
	initialize: function($super) {
		$super("RK4Integrator");
	},
	run: function() {
		this.log.w("[" + this.name + "] Starting test");
		var i;
		var iS = new GeRK4State();
		var Integrator = new GeRK4Integrator();
		iS.force.x = 1;
		var startTime = Date.now();
		var dt = 15;
		for (i = 0; i < 10; i++) {
			currentTime = Date.now();
			var delta = currentTime - startTime; 
			this.log.w("[" + i + "] dt: " + dt + ", delta: " + delta + ", x: " + iS.pos.x + ", y: " + iS.pos.y + ", mag: " + iS.force.mag());
			Integrator.integrate(iS, startTime, dt);
			for(k=0; k < 1000; k++) {
				document.getElementById("GameRand").innerHTML = Math.random() * 0.12345 * 10;
			}
			startTime = currentTime;
		}
	}
});


function start() {
	Test = new GeTest_RK4Integrator();
}