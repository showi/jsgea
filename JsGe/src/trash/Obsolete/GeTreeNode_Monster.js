var GeGx_Monster_Ball = Class.create({
	initialize: function(parent) {
		this.parent = parent;
	},
	draw: function(ctx) {
		//ctx.save();	
		ctx.rotate(this.parent.rotate);
		
		ctx.translate(this.parent.phys.pos.x , this.parent.phys.pos.y);
	
		// 10;//Math.PI/180;
		//console.debug(this.parent.rotate);
		ctx.beginPath();
		ctx.fillStyle = "rgba(20, 20, 200, 0.8)";
		ctx.strokeStyle = "rgba(255, 20, 200, 1)";
		ctx.arc(0, 0, 5, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke;
		
		//ctx.restore();
	},
});

var GeTreeNode_Monster_Ball = Class.create(GeTreeNode, {
	initialize: function($super, parent) {
		$super(parent);
	},
	_init: function(parent) {
		this.type = "monster_ball";
		this.unfreeze();
		this.unhide();
		this.enable_physics();
		this.phys.pos.x = 20;
		this.phys.pos.y = 0;
		this.rotate = 0;
		this.gx = new GeGx_Monster_Ball(this);
	},
	
	update: function($super, dt) {
		$super(dt);
		this.rotate += (Math.PI /180/3) * (dt);
		if(this.rotate > Math.PI*2) {
			this.rotate = 0;
		}
	
	}
});


var GeTreeNode_Monster = Class.create(GeTreeNode, {
    initialize: function($super, parent) {
        $super(parent);
    },
    _init: function(parent) {
        this.type = "monster";
        this.unfreeze();
        this.unhide();
		this.enable_physics();
        this.phys.pos.x = Math.round(Math.random()*512);
        this.phys.pos.y = Math.round(Math.random()*512);
		var minus = 1;
		if (Math.random() > 0.5) {
			minus = -1
		}
        this.phys.force.x = (Math.random() * minus )/3;
		minus = 1;
		if (Math.random() > 0.5) {
			minus = -1
		}
        this.phys.force.y = (Math.random()* minus) /3;
		
        this.gx = new GeGx_Monster(this);
        this.bound = new GeBound(this);
        this.bound.add(new GeBoundingCircle(this, this.gx.width/2));
		this.bound.grid = 1;
		
		/* DEBUG */
		var drawForce = new GeTreeNode_Vector(this, this.phys.force); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#AA00AA");
		//this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		drawForce.set_color("#FF0000");
		//this.add_child(drawForce);
		
		drawForce = new GeTreeNode_Vector(this, this.phys.velocity.normal()); //this.phys.force);
		drawForce.phys.pos = this.phys.pos;
		var that = this
		drawForce.postupdate = function(dt) {
			that.vector = that.phys.velocity.normal();
		}
		//drawForce.set_color("#0000AA");
		//drawForce.unfreeze();
		//drawForce.unhide();
		//this.add_child(drawForce);
		this.add_child(
			new GeTreeNode_Monster_Ball(this)
		);
	},
	preload_ressources: function($super) {
		ShoGE.w("Loading monster ressources");
		ShoGE.Core.Images.add("ball-blue-32x32.png");
		ShoGE.Core.Images.add("ball-cover-32x32.png");
		ShoGE.Core.Images.add("ball-infected-32x32.png");
		//$super();
	},
	
});


var GeGx_Monster = Class.create({
    initialize: function(parent) {
        this.parent = parent;
        this.width = 32;
        this.height = 32;
    },
    draw: function(ctx) {
        var phys = this.parent.phys;
		var pos = phys.interpolate();
		//console.debug(pos.x + ", " + pos.y);
		//ctx.save();
    
		ctx.translate(pos.x, pos.y);
	    ctx.save();
		ctx.translate(-16, -16);
        ctx.drawImage(ShoGE.Core.Images.get("ball-blue-32x32.png").get(), 0, 0);
        ctx.drawImage(ShoGE.Core.Images.get("ball-cover-32x32.png").get(), 0, 0);
		ctx.drawImage(ShoGE.Core.Images.get("ball-infected-32x32.png").get(), 0, 0);
		ctx.restore();
	},
});
