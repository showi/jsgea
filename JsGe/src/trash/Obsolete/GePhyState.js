/* @PhysicalState: Storing physical state of game object
	R4K Integration: http://gafferongames.com/game-physics/integration-basics/
*/
var GePhysState = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.pos = parent.position;
		this.velocity = new Vector2D(0.0,0.0);
		this.force = new Vector2D(0.0, 0.0);
		this.movable = false;
		this.solid = false;
		this.set_mass(10.0);
		this.width = 32;
		this.height = 32;
		this.minval = 0.000001;
		this.recalculate_momentum();
	},
	get_force: function() {
		return this.force();
	},
	set_mass: function(mass) {
		this.mass = mass;
		this.invmass = 1.0 / mass;
	},
	setPosX: function(x) {
		this.pos.x = x;
	},
	setPosY: function(y) {
		this.pos.y = y;
	},
	getPosX: function() {
		return this.pos.x;
	},
	getPosY: function() {
	return this.pos.y;
  },
	isSolid: function() {
	return this.solid;
  },
	setSolid: function(bSolid) {
	this.solid = bSolid;
  },
	isMovable: function() {
	return this.movable;
  },
	setMovable: function(bMovable) {
	this.movable = bMovable;
  },
	applyForce: function(force) {
	if (!this.force) {
		this.force = new Vector2D(0,0);
	}
	this.force.add(force);
  },
	copy_state: function() {
	var c = new Object();
	c.pos = this.pos.clone();
	return c;
  },
	interpolate: function() {
		if (!this.lastState) {
			return this.pos;
		}
		if (!ShoGE.Core.DiscreteTime.alpha) { // NAN
			return this.pos;
		}
		var pos = this.pos.clone().mul(
			ShoGE.Core.DiscreteTime.alpha
		).add(this.lastState.pos.clone().mul(1.0 - ShoGE.Core.DiscreteTime.alpha));
		//pos.round();
		return pos;
  },
   recalculate_momentum: function() {
		this.momentum = this.velocity.clone().mul(this.mass);	
   },
   /* Physic update */
	update: function(dt) {
		if (!this.lastState) {
			this.lastState = this.copy_state();
		}
		var v2 = this.force.clone().mul(dt);
		this.velocity = v2;
		this.recalculate_momentum();
		this.pos.add(v2.clone());
		this.grid_bounding();
		return;
	},
	
	grid_bounding: function() {
		if (!this.parent.bound || !this.parent.bound.grid) {
			
			return;
		}
		var ccell = this.parent.get_parent('cell');
		if (!ccell) { return; }
		//alert("plop");
		var maxcellX = ccell.x * ccell.parent.cell_size + ccell.parent.cell_size;
		var maxcellY = ccell.y * ccell.parent.cell_size + ccell.parent.cell_size;
		var x = Math.round(this.pos.x);
		var y = Math.round(this.pos.y);
		if (ccell.tiles[y*32+x]  && ccell.tiles[y*32+x].walkable) {
			//console.debug("Walkable");
			this.force.inv();
			return;
		}
		if (this.pos.x < 0 || this.pos.x > maxcellX) {
			if (this.pos.x < 0) {
				this.pos.x = 1;
			} else {
				this.pos.x = maxcellX -1;
			}
			this.force.invX();
		}
		if (this.pos.y < 0 || this.pos.y > maxcellY) {
			if (this.pos.y < 0) {
				this.pos.y = 1;
			} else {
				this.pos.y = maxcellY -1;
			}
			this.force.invY();
		}
		
		
	}
});
