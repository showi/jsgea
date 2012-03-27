var GeColor = Class.create({
	initialize: function(r, g, b, a) {
		this.data = new Array();
		this.set_r(r);
		this.set_g(g);
		this.set_b(b);
		this.set_a(a);
	},
	
	bound: function(v) {
		if (v < 0) v = 0;
		if (v > 255) v = 255;
		return v;
	},
	
	set_r: function(v) {
		this.data[0] = this.bound(v);
	},
	
	set_g: function(v) {
		this.data[1] = this.bound(v);
	},
	
	set_b: function(v) {
		this.data[2] = this.bound(v);
	},
	
	set_a: function(v) {
		this.data[3] = this.bound(v);
	},
	
	get_r: function() {
		return this.data[0];
	},

	get_g: function() {
		return this.data[1];
	},
	
	get_b: function() {
		return this.data[2];
	},
	
	get_a: function() {
		return this.data[3];
	},
	
	as_string: function() {
		return "rgba("+this.data[0]+","+this.data[1]+","+this.data[2]+","+this.data[3]+")";
	}
	
});