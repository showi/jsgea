var GeX = 0;
var GeY = 1;
var GeZ = 2;

var GeVector3D = Class.create({
	
	initialize: function(x, y, z) {
		this._A = new Array();
		this.set(x, y, z);
		//this.set_updated(true);
		return this;
	},
	clone: function() {
		return new GeVector3D(this._A[GeX], this._A[GeY], this._A[GeZ]);
	},
	/*set_updated: function(b) {
		this.updated = b;
	},*/
	setX: function(v) {
		//if (this.getX() != v) { this.set_updated(true); }
		this._A[GeX] = v;
		return this;
	},
	
	setY: function(v) {
		//if (this.getY() != v) { this.set_updated(true); }
		this._A[GeY] = v;
		return this;
	},
		
	setZ: function(v) {
		//if (this.getZ() != v) { this.set_updated(true); }
		this._A[GeZ] = v;
		return this;
	},
	
	set: function(x, y, z) {
		this._A[GeX] = x;
		this._A[GeY] = y;
		this._A[GeZ] = z;
		return this;
	},
	
	getX: function() {
		//if (this.getX() != v) { this.set_updated(true); }
		return this._A[GeX];
	},
	
	getY: function() {
		//if (this.getY() != v) { this.set_updated(true); }
		return this._A[GeY];
	},
		
	getZ: function() {
		//if (this.getZ() != v) { this.set_updated(true); }
		return this._A[GeZ];
	},
	
	add: function(vB) {
		this._A[GeX] += vB._A[GeX];
		this._A[GeY] += vB._A[GeY];
		this._A[GeZ] += vB._A[GeZ]
		return this;
	},
	sub: function(vB) {
		this._A[GeX] -= vB._A[GeX];
		this._A[GeY] -= vB._A[GeY];
		this._A[GeZ] -= vB._A[GeZ];
		return this;
	},	
	mul: function(n) {
		this._A[GeX] *= n;
		this._A[GeY] *= n;
		this._A[GeZ] *= n;
		return this;
	},
	div: function(n) {
		this._A[GeX] /= n;
		this._A[GeY] /= n;
		this._A[GeZ] /= n;
		return this;
	},
	
	inv: function() {
		this._A[GeX] = - this._A[GeX];
		this._A[GeY] = - this._A[GeY];
		this._A[GeZ] = - this._A[GeZ];
		return this;
	},
	
	mag: function() {
		return Math.sqrt(
			(this._A[GeX] * this._A[GeX]) + (this._A[GeY] * this._A[GeY])
		);
	},
	normalize: function() {
		var m = this.mag();
		if (m != 0) {
			this.x /= m;
			this.y /= m;
		}
		return this;
  },
	
	round: function() {
		this._A[GeX] = Math.round(this._A[GeX]);
		this._A[GeY] = Math.round(this._A[GeY]);
		this._A[GeZ] = Math.round(this._A[GeZ]);
		return this;
	},
	
	floor: function() {
		this._A[GeX] = Math.floor(this._A[GeX]);
		this._A[GeY] = Math.floor(this._A[GeY]);
		this._A[GeZ] = Math.floor(this._A[GeZ]);		
		return this;
	},
	
	prettyPrint: function() {
		return "(" + this._A[GeX] + ", " + this._A[GeY] + ", " + this._A[GeZ] + ")";
	}
});


