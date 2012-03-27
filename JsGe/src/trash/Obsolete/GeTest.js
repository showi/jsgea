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
