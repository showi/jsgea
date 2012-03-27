var Entity_Monster_Skeleton = Class.create(GeEntity_Creature, {
	
	initialize: function($super, parent, width) 
	{
		$super(parent, width);
		//this.enable('ai', new GeMapAI(this));
		this.enable('animation', new GeEntityAnimation(this));
		this.enable('canvas', new GeDrawAnimation(this));
		var a = this.Animation;
		var ts = ShoGE.Core.TilesetPool.get('img/skeleton_0.png');
		a.set("walk_" + GE_N, ts.getAnim("walk_"+GE_N).getWalker());
		a.set("walk_" + GE_E, ts.getAnim("walk_"+GE_E).getWalker());
		a.set("walk_" + GE_S, ts.getAnim("walk_"+GE_S).getWalker());
		a.set("walk_" + GE_W, ts.getAnim("walk_"+GE_W).getWalker());
		a.setCurrent("walk_" + GE_E);
	},
	
});