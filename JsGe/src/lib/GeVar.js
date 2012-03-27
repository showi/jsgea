var GeVar = Class.create({
	initialize: function(value, dl, ul) {
		this.ulimit = ul;
		this.dlimit = dl;
		this.flag = 0;
		this.set(value);
	},
	set_ulimit: function(limit) {
		this.ulimit = limit;
		this._ulimit(limit);
	},
	set_dlimit: function(limit) {
		this.dlimit = limit;
		this._dlimit(limit);
	},
	set: function(value) {
		this.value = value;
		if (this.ulimit != null) {
			this._ulimit(this.ulimit);	
		}
		if (this.dlimit != null) {
			this._dlimit(this.dlimit);
		}
	},
	get: function() {
		return this.value;
	},
	_ulimit: function (limit) {
		if(this.value > limit) {
			this.flag = 1;
			this.value = limit;
		} else {
			this.flag = 0;
		}
	},
	_dlimit: function (limit) {
		if(this.value < limit) {
			this.flag = -1;
			this.value = limit;
		} else {
			this.flag = 0;
		}
	},
	inc: function(inc) {
		this.set(this.value + inc);
	},
	dec: function(dec) {
		this.set(this.value - inc);
	}
});
