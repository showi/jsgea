var GeCollision = Class.create({
	initialize: function(parent, type, objA, objB) {
		this.parent = parent;
		this.type = type;
		this.A = objA;
		this.B = objB;
		this.calcNormal()
	},
	calcNormal: function() {
		if (this.type == 'cc') {
			var wallNormal = new Vector2D(0,0).link(this.A.phys.pos, this.B.phys.pos);
			this.wallNormal = wallNormal.normalize();
		}
	},
	correct: function() {
		if (this.type == 'cc') {
			this.correct_cc();
		}
	},
	correct_cc: function() {
		//ShoGE.w("Correct cc");
		var wN = this.wallNormal.clone();
		wN.mul(this.delta+1);
		this.A.phys.pos.sub(wN);
	},
	
	response: function() {
		if (this.type == 'cc') {
			this.response_cc();
		}
	},
	
	response_cc: function() {
		this.A.phys.force.inv();
		this.B.phys.force.inv();
	return;
		var delta = new Vector2D(0,0).link(this.A.phys.pos, this.B.phys.pos);
		var d = Math.abs(delta.mag());
		var mtd = delta.clone().normalize().mul((this.dist - d ) / d);
		
		// impact speed
		var v = this.A.phys.velocity.clone().sub(this.B.phys.velocity);
		var vn = v.dot(mtd.clone().normalize());
		if (vn > 0.0) return;
		
		// Collision impulse
		var ConstantRestitution = 0.5; 
		var i = (-(1.0 + ConstantRestitution) * vn) / (this.A.phys.invmass + this.B.phys.invmass);
		var impulse = mtd.mul(i);
		
		this.A.phys.velocity.add(impulse.clone().mul(this.A.phys.invmass));
		this.B.phys.velocity.add(impulse.clone().mul(this.B.phys.invmass));
		
		/*
		//ShoGE.w("res cc");
		var wn = this.wallNormal.inv();
		var l = this.A.phys.velocity.mag();
		var pU = this.A.phys.velocity.proj(wn).inv();
		var pV = this.A.phys.velocity.proj(wn.normal()).inv();
		var f = pU.clone().add(pV).normalize().mul(l);
		this.A.phys.velocity = f;*/
	},
});
