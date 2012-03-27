var GeNode = Class.create(GeObject, {

	initialize: function($super, parent) 
	{
		$super(parent);
		this.setType("#NODE#", "#NODE#");
	},

	enable: function(c, object) 
	{
		switch(c) {
			case 'childs':
				if (!this._childs) {
					this._childs = new GeLinkedList();
				}
			break;
			default: 
				throw("Unknown option: " + object);
		}
	},
	
	hasChild: function() 
	{
		if (this._childs) {
			//ShoGE.w("yes has one child");
			return true;
		}
		return false;
	},
	
	hasPhysic: function() 
	{
		if (this.Physic) {
			//ShoGE.w("yes has one child");
			return true;
		}
		return false;
	},
	
	addChild: function(child) 
	{
		child.set_parent(this);
		this._childs.add(child);
		return child;
	},
	
	removeChild: function(child) {
			//ShoGE.w("Removing child");
			return this._childs.remove(child);
	},
	
	traverseDown: function(callback) 
	{
		callback(this);
		if (this.hasChild()) {
			var it = this._childs.iterator();
			var child;
			while(child = it.next()) {
					child.data.traverseDown(callback);
			}
		}
	},
	
	traverseUp: function(callback) 
	{
		if (this.hasChild()) {
			var it = this._childs.iterator();
			var child;
			while(child = it.next()) {
					child.data.traverseUp(callback);
			}
		}
		callback(this);
	},
	

	
	prettyPrint: function($super) 
	{
		var msg = "[Node] ";

		msg +=  $super();
		return msg;
	},
});