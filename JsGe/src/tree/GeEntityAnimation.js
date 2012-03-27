var GeEntityAnimation = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.animations = new Hash();
		this.current = null;
	},
	
	set: function(name, walker) {
		if (this.animations.get(name)) {
			throw ("Walker already defined for this name");
		}
		this.animations.set(name, walker);
	},
	
	get: function(name) {
		return this.animations.get(name);
	},
	
	setCurrent: function(name) {
		var a = this.animations.get(name);
		if (!a) {
			throw("Cannot set animation named " + name + " as current");
		}
		this.current = a;
	},
	
	getCurrent: function() {
		//ShoGE.w(this.current);
		return this.current;
	},
	update: function(dt) {
		if (this.current) { this.current.update(dt); }
	}
	
});