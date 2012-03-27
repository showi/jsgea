var GeTimer = Class.create(GeObject, {
	initialize: function($super) {
		$super();
		//var date = new Date();
		this.bRunning = false;
	},
	start: function() {
		if (this.bRunning) {
			var msg = "[" + this.core_id + "] Cannot start already started timer";
			ShoGE.w(msg);
			return false;
		}
		this.bRunning = true;
		var date = new Date();
		this.starttime = date.getTime();
		this.endtime = null;
		return true;
	},
	stop: function() {
		if (!this.bRunning) {
			var msg = "[" + this.core_id + "] Cannot stop non running timer";
			ShoGE.w(msg);
			return false;
		}
		this.bRunning = false;
		var date = new Date();
		this.endtime = date.getTime();
		return true;
	},
	
	delta: function() {
		var endtime;
		if (this.endtime == null) {
			var date = new Date();
			endtime = date.getTime();
		} else {
			endtime = this.endtime;
		}
		return endtime - this.startime;
	},
	get_start: function() {
		return this.starttime;
	},
	get_stop: function() {
		return this.endtime;
	}

});
