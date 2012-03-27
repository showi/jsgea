var GeEntity_Creature = Class.create(GeEntity, {

	initialize: function($super, parent, width) 
	{
		$super(parent);
		var w = width/2;
		this.setU(w, 0, 0);
		this.setV(0, w, 0);
		this.enable('physic');
	},
	
});