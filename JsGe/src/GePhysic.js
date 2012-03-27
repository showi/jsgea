var GePhysic = Class.create(GeObject, {
	initialize: function($super) {
		$super(parent);
		this.forces = new GeVector3D(0,0,0);
	},	
	
	addForce: function(force) {
		this.forces.addForce(force);
	},
	
	update: function(dt) {
		//ShoGE.w("Update Phys");
	},
	
});