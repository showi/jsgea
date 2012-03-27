const GE_LOG = 0;
const GE_WARN = 1;
const GE_CRIT = 2;
const GE_DEBUG = 3;

var GeLog = Class.create(GeObject, {
	
	initialize: function($super, id) 
	{
		$super();
		this.elm = document.getElementById(id);
		this.count = 0;
		
	},
	
	w: function(msg, o) {
		var m = "["  + Date.now() + "] ";
		if (o) { m+= "(" + o.className + ") "; }
		m+= msg; 
		if (typeof(console)) { console.log(m); return; }
	},
	
});
