var Vector2D = Class.create({

	initialize: function(x, y) {
		this.set(x, y);
		return this;
	},

	is_vector: function(v) {
		if (v instanceof Vector2D) {
			return true;
		}
		return false;
	},
	
	set: function(x, y) {
		this.x = x;
		this.y = y;
	},
	
	clone: function() {
		return new Vector2D(this.x, this.y);
    },
	
	equals: function(v) {
        if (this.x != v.x || this.y != v.y) {
            return false;
        }
        return true;
    },
    
	mag: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
  
	add: function(b) {
		this.x += b.x;
		this.y += b.y;
		return this;
	},
  
	sub: function(b) {
	this.x -= b.x;
    this.y -= b.y;
    return this;
  },
  inv: function() {
    this.x = - this.x;
    this.y = - this.y;
    return this;
  },
  mul: function(b) {
    this.x *= b;
    this.y *= b;
    return this;
  },
  dist: function (b) {
    var dist = Math.sqrt(Math.pow(b.x - this.x, 2) + Math.pow(b.y - this.y, 2));
    return dist;
  },

  dot: function(b) {
    return this.x * b.x + this.y * b.y;
  },
  angle: function(v) {
    return Math.PI/180 * Math.acos(this.dot(v));
  },
  angled: function(v) {
    return Math.acos(this.dot(v));
  },
  normalize: function() {
    var m = this.mag();
    if (m != 0) {
        this.x /= m;
        this.y /= m;
    }
    return this;
  },
  link: function(A, B) {
    this.x = B.x - A.x;
    this.y = B.y - A.y;
    return this;
  },
  normal: function() {
    var v = new Vector2D(0,0);
    v.x = - this.y;
    v.y =  this.x;
    return v;
  },
  proj: function(b) {
        var dp = this.dot(b);
        var p = new Vector2D(0,0);
        p.x = (dp / (b.x * b.x + b.y * b.y)) * b.x;
        p.y = (dp / (b.x * b.x + b.y * b.y)) * b.y;
        return p;
  },

  invX: function() {
    this.x = - this.x;
  },

  invY: function() {
    this.y = - this.y;
  },
  round: function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  },
});
