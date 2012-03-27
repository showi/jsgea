var MtCreature = Class.create(GeTreeNode, {
	initialize: function($super, parent) {
		$super(parent);
	},
	
	_init: function(parent) {
			this.set_type("creature");
			this.unfreeze();
			this.unhide();
			this.enable_physics();
	
			this.life = 100;
	},

});


/* 
	BLOB
*/
var MtGxBlob = Class.create({
	
	initialize: function(parent) {
		this.parent = parent;
	},
	
	draw: function(ctx) {
		//alert(this.parent.position.x + ", " + this.parent.position.y);
		ctx.translate(this.parent.position.x, this.parent.position.y);
		ctx.save();
		ctx.translate(this.parent.size /2, this.parent.size / 2);
		ctx.beginPath();
		ctx.fillStyle = this.parent.color.as_string();
		ctx.strokeStyle = "rgba(255, 0, 0, 255)";
		ctx.arc(0, 0, this.parent.size, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke;
		ctx.restore();
	},
	
});

var MtBlob = Class.create(MtCreature, {
	initialize: function($super, parent) {
		$super(parent);
	},
	
	_init: function($super, parent) {
		$super(parent);
		this.size = Math.random() * 8 + 8;
		this.cross_factor = Math.random();
		this.set_type('blob');
		this.color = new GeColor(255,0,0,255);
		for (var i = 0; i < 4; i++) {
			this.color.data[i] = Math.round(Math.random() * 255);
		}
		if (this.color.data[3] < 100) this.color.data[3] = 100;
		//alert(this.color.as_string());
		this.gx = new MtGxBlob(this);
		this.position.x = 34+ Math.random() * 608 + 16;
		this.position.y = Math.random() * 448 + 16;
	},
	
});


/*
	Player
*/
var MtGxPlayer = Class.create({
	
	initialize: function(parent) {
		this.parent = parent;
	},
	
	draw: function(ctx) {
		alert("plop");
		//alert(this.parent.position.x + ", " + this.parent.position.y);
		ctx.translate(this.parent.position.x, this.parent.position.y);
		ctx.save();
		//ctx.translate(this.parent.size /2, this.parent.size / 2);
		ctx.beginPath();
		ctx.fillStyle = this.parent.color.as_string();
		ctx.strokeStyle = "rgba(255, 0, 0, 255)";
		ctx.arc(0, 0, 16, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
		ctx.stroke;
		ctx.restore();
	},
	
});

var MtPlayer = Class.create(MtCreature, {
	initialize: function($super, parent) {
		$super(parent);
	},
	
	_init: function(parent) {
		this.set_type("player");
		this.color = new GeColor(255, 0, 0, 255);
		this.gx = new MtGxPlayer(this);
	},
	
});