var GeTreeNode_Block = Class.create(GeTreeNode, {
	initialize: function($super, parent, pos, u, v) {
		$super(parent);
		this._init(pos, u, v);
	},
	_init: function(pos, u, v) {
        this.type = "block";
		this.phys = new GePhysState(this);
		this.phys.pos = pos;
		this.bound = new GeBound(this);
        this.bound.add(new GeBoundingBox(this, u, v));
	},
	
});
