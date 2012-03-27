var GeBoundingCircle = Class.create(GeBounding, {
	initialize: function($super, parent, radius) {
		$super(parent);
		this.type = 'circle';
		this.radius = radius;
	},
	
	check_cc: function(node) {
		//-> Don't want to collide against ourself
		if (this.parent == node) {
			return null;
		}
		var tradius = this.radius + node.bound.circle.radius;
		var dist = this.parent.phys.pos.dist(node.phys.pos);
		var delta = dist - tradius;
		if (delta < 1) {
			var c = new GeCollision(parent, 'cc', this.parent, node);
			c.tradius = tradius;
			c.dist = dist;
			c.delta = -delta;
			return c;
		} else {
				return null;
		}
		return null;
	},

	collide: function(node) {	
		var c = null;
		if (node.bound) {
			if (node.bound.circle) {
				//alert("cc");
				if (c = this.check_cc(node)) {
					return c;
				}
			} else if (node.bound.box) {
				/*if (c = this.check_cb(node)) {
					return c;
				}*/
			}
		}
		var it = node.childs.iterator();
		var child;
		while(child = it.next()) {
			if (c = this.collide(child.data)) {
				return c;
			} 
		}
		return null;
	}
	
});
