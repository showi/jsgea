var GeEntity = Class.create(GeNode, {

	initialize: function($super, parent) 
	{
		$super(parent);
		this.setType("#ENTITY#", "#ENTITY#");
		this.Position = new GeVector3D(0,0,0);
		this.IsoPosition = new GeVector3D(0,0,0);
		this.u = new GeVector3D(1,0,0);
		this.v = new GeVector3D(0,1,0);
		this.setNeedRedraw(true);
	},
	
	setNeedRedraw: function(b) 
	{
		this.bNeedRedraw = b;
	},
	
	needRedraw: function() 
	{
		return this.bNeedRedraw;
	},
	
	enable: function($super, c, object) {
		switch(c) {
			case 'physic':
				this.Physic = new GePhysic(this);
			break;
			case 'ai':
				this.AI = object;
			break;
			case 'canvas':
				this.canvas = object;
			break;
			case 'animation':
				this.Animation = object;
			break;
			default:
				$super(c, object);
			
		}
	},
	
	setPosition: function(x, y) {
		this.Position.set(x * ShoGE.Core.tileWidth, y * ShoGE.Core.tileHeight, 0);
		var iX = (x - y) * ShoGE.Core.tileWidth/2;
		var iY = ((x + y)) * ShoGE.Core.tileHeight/4;
		this.IsoPosition.set(iX, iY, 0);
	},
	

	setCardinalDirection: function(card) 
	{
		this.cardinalDirection = card;
	},
	
	getCardinalDirection: function() {
		return this.cardinalDirection;
	},
	
	setU: function(x, y, z) 
	{
		this.u.set(x,y,z);
	},
	
	setV: function(x, y, z) 
	{
		this.v.set(x,y,z);
	},
	
	hookPreUpdate: function(that) {
		ShoGE.w("PreUpdate");
	},
	
	update: function(dt) 
	{
		//return;
		this.traverseDown(function(that) {
			if (that.Animation)  {
				that.Animation.update(dt);
			}
			if (that.Physic) {
				//that.Physic.update(dt);
			}
			if (that.AI) {

			}
			//that.hookPostUpdate(that);
		});
	},
	
	draw: function(renderer) 
	{
		renderer.save();
		this.traverseDown(function(that) {
			if (that.AI) {
				that.AI.update(1);
			}
			if (that.IsoPosition) {
			//ShoGE.w('trans');
				renderer.translate(that.IsoPosition.getX(), that.IsoPosition.getY());
			}
			if (that.canvas) {
				that.canvas.draw(renderer);
			}
			
		});
		renderer.restore();
	},
	

	preload_ressources: function() 
	{
		; // Stub
	},
	
	post_rendering: function() { ; },
	
	prettyPrint: function($super) {
		var msg = $super();
		msg+= "Position: " + this.Position.prettyPrint();
		return msg;
	}
});
