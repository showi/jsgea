var GeObject = Class.create({

	initialize: function(parent) 
	{
		this.core_id = ShoGE.GenID.get();
		this.parent = parent;
		this.setType('GeObject', "#GeObject#DEFAULT");
		this.setClassName('GeObject');
	},
		
	setClassName: function(className) 
	{
		this.className = className;
	},
	
	getClassName: function() 
	{
		return this.className;
	},
	
	set_parent: function(parent) 
	{
		this.setParent(parent);
	},

	setParent: function(parent) 
	{
		this.parent = parent;
	},
	
	get_root: function() 
	{
		if (this.parent) {
			return this.parent.get_root();
		} else {
			return this;
		}
	},
	
	getRootType: function(type) {
		if (!this.parent) {
			return null;
		} 
		if (this.parent.type == type) {
			return this.parent;
		}
		return this.parent.getRootType(type);
	},
	
	setSubType: function(type) 
	{
		this.subtype = type;
	},	
	
	setType: function(type, subtype) 
	{
		this.type = type;
		if (subtype != null) {
			this.setSubType(subtype);
		}
	},
	
	getType: function() 
	{
		return this.type;
	},
	
	getSubType: function() 
	{
		return this.subtype;
	},
	
	prettyPrint: function() {
		var msg = "CoreID: " + this.core_id + "\n";
		msg += "hasParent: ";
		if (this.parent) {
			msg += " yes";
		} else {
			msg += " no";
		}
		msg += "\n";
		if (this.type) { msg += this.type; }
		msg += "-";
		if (this.subtype) { msg += this.subtype; }
		msg += "\n";
		return msg;
	},
	
});

var GeLoadable = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.setLoaded(false);
	},
	
	setLoaded: function(b) {
		this.bLoaded = b;
	},
	
	isLoaded: function() {
		return this.bLoaded;
	}
	
}) ;
