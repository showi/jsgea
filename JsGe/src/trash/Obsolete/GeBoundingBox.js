var GeBoundingBox = Class.create(GeBounding, {
	initialize: function($super, parent, u, v) {
		$super(parent);
		this.type = 'box';
		this.u = u;
		this.v = v
	},
	collide: function(sg) {	
		return null;
	}
});
