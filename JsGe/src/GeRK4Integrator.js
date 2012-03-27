var GeRK4State = Class.create({
	initialize: function() {
		this.pos = new Vector2D(0, 0);
		this.force = new Vector2D(0, 0);
	},
	set_pos: function(x, y) {
		this.pos.set(x, y);
	},
	set_force: function(x, y) {
		this.force.set(x, y);
	},
	add: function(s) {
		this.pos.add(s.pos);
		this.force.add(s.force);
		return this;
	},
	mul: function(n) {
		this.pos.mul(n);
		this.force.mul(n);
		return this;
	},
	clone: function() {
		var ns = new GeRK4State();
		ns.pos = this.pos.clone();
		ns.force = this.force.clone();
		return ns;
	}
});

var GeRK4Integrator = Class.create({
	initialize: function() {

	},
	momentum: function (state, t) {
		k = 10.0;
		b = 1;
		var pos = state.pos.clone();
		var force = state.force.clone().mul(t);
		//force.mul(b);
		//pos.mul(-k);
		pos.add(force);
		return force;
	},
	
	evaluate: function(i, t, dt, d) {
		alert("Evaluate: " + i + " " + t + " " + dt + " " + d);
		var state = i.clone().add(d.clone().mul(dt));
		
		var output = new GeRK4State();
		output.pos = state.pos.clone();
		output.force = this.momentum(state, t + dt);
		return output;
	},
	
	integrate: function(s, t, dt) {
		var dA = this.evaluate(s, t, 0.0, new GeRK4State());
		var dB = this.evaluate(s, t + dt*0.5, dt*05,  dA);
		var dC = this.evaluate(s, t + dt*0.5, dt*05,  dB);
		var dD = this.evaluate(s, t + dt, dt,  dC);
		
		var ddt = dB.clone();
		ddt.add(dC).mul(2.0).add(dD).add(dA).mul(dt);
		//var fs = new RK4State().clone(s).add(ddt);
		s.add(ddt);
		return s;
	},
});
