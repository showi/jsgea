
var GeTreeNode_Coordinate = Class.create(GeTreeNode, {
    initialize: function($super, parent, vector) {
        $super(parent);
		//this.parent  = parent;
		this.vector = vector;
    },
   
    _init: function(parent) {
		this.type = "coordinate";
        this.unfreeze();
        this.unhide();
		this.enable_physics();
		var u = new GeTreeNode_Vector(this, new Vector2D(1,0));
		u.set_color("#FF0000");
		var v = new GeTreeNode_Vector(this, new Vector2D(0,1));
		v.set_color("#0000FF");
		this.add_child(u);
		this.add_child(v);
	},
});
