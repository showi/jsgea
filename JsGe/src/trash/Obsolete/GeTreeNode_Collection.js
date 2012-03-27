var GeTreeNode_Collection = Class.create(GeTreeNode, {
	initialize: function($super, parent, name) {
		$super(parent);
		this.name;
	},
	_init: function(parent) {
        this.type = "collection";
	},
	update: function($super, dt) {
		var it = this.childs.iterator();
		var child;
		while(child = it.next()) {
			child.data.update(dt);
		}
	},
	
	collide: function($super) {
		var it = this.childs.iterator();
		var child;
		while(child = it.next()) {
			child.data.collide();
		}
	}
	
});
