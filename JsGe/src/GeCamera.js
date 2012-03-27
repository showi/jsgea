var GeCamera = Class.create(GeEntity, {

	initialize: function($super, parent, target) 
	{
		$super(parent);
		this.setClassName('GeCamera');
		this.track(target);
	},
	
	track: function(node)
	{
		this.tracked = node;
	},
	
	untrack: function()
	{
		this.tracked = null;
	},
	
	draw: function(renderer)
	{
		if (this.tracked) {
			if (this.tracked.parent) {
				var p = this.tracked.parent.IsoPosition;
				renderer.translate(-p.getX(),  -p.getY());
			}
		}
	},

});
