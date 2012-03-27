var GeCreatureStats = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.setLife(100);
		this.setEnergy(100);
		this.setMana(100);
		this.setSpirit(100);
		this.setIntellect(100);
		this.setForce(100);
		this.setDefense(100);
		this.setMagicDefense(100);
	},
	
	setLife: function(v) 
	{
		this.life = v;
	},
	
	getLife: function() 
	{
		return this.life;
	},
	
	setEnergy: function(v) 
	{
		this.energy = v;
	},
	
	getEnergy: function() 
	{
		return this.energy;
	},
	/*
		La vie ne chute que lors d'action exterieur. 
		L'énergie décroit quoi qu'il arrive sauf si le joueur est en idle auquel cas elle croit. Il faut dormir
		pour se régénérer vite.
		
	*/
	
});

const GE_STATE_IDLE = 0;
const GE_STATE_WORK = 1;
const GE_STATE_SLEEP = 2;
const GE_STATE_FIGHT = 3;


var GeAIState_IDLE = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.minWait = 1000;
		this.maxWait = 3000;
	},
	
	update: function(dt) {
		var diff = Date.now() - this.lastUpdate;
		if (diff < this.minWait) {
			return;
		}
		ShoGE.w("Must found work");
	},
});

var GeAIState = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.previousState = null;
		this.state = GE_STATE_IDLE;
		this.add_action(GE_STATE_IDLE, new GeAIState_IDLE(this));
		this.lastUpdate = Date.now();
	},
	update: function(dt) {
		this._action[this.state].update(dt);
		this.lastUpdate = Date.now();
	},
	
});

var GeCreatureClass = Class.create(GeObject, {
	initialize: function($super, parent) 
	{
		$super(parent);
		this.setMaxMove(1);
		this.setRestMove(this.getMaxMove());
		this.setTimeBtwMove(60);
		this.setTimeLastMove(null);
	},
	
	setMaxMove: function(step) {
		this.maxMove = step;
	},
	getMaxMove: function() {
		return this.maxMove;
	},
	setTimeBtwMove: function(t) {
		this.timeBtwMove = t;
	},
	getTimeBtwMove: function() {
		return this.timeBtwMove;
	},
	setTimeLastMove: function(t) {
		this.timeLastMove = t;
	},
	getTimeLastMove: function() {
		return this.timeLastMove;
	},
	setRestMove: function(step) {
		this.restMove = step;
	},
	getRestMove: function() {
		return this.restMove;
	},
	canMove: function() {
		if (this.getRestMove() > 0) {
			return true;
		} else {
			var d = Date.now() - this.getTimeBtwMove()
			if (d > this.getTimeLastMove()) {
				this.setTimeLastMove(Date.now());
				this.setRestMove(this.getMaxMove());
				return true;
			}
		
		}
		return false;
	}
});




var GeDrawBox = Class.create(GeObject, {
	
	initialize: function($super, parent, fillStyle, strokeStyle) 
	{
		$super(parent);
		this.setFillStyle(fillStyle);
		this.setStrokeStyle(strokeStyle);
	},
	
	setFillStyle: function(style) 
	{
		this.fillStyle = style;
	},
	
	setStrokeStyle: function(style) 
	{
		this.strokeStyle = style;
	},	
	
	draw: function(renderer) 
	{
		var  ctx = renderer.getContext(GE_LAYER_GROUND);
		var img = ShoGE.Core.Player.Animation.getCurrent();
		if (img) {
			var can = img.getCanvas();//ShoGE.Core.Player.Anim.getImage();
			ctx.drawImage(can, 0,0, this.parent.u.getX()*2,this.parent.v.getY()*2);	
		}
	}
});

var GeAI = Class.create(GeObject, {
	initialize: function($super, parent) 
	{
		$super(parent);
	},
});

var GeMapAI = Class.create(GeAI, {
	initialize: function($super, parent) 
	{
		$super(parent);
		this.lastDirection = this.randomDirection();
		this.totalDt = 0;
		this.pathFind = new GePathFindingA(this, 32);
	},
	randomDirection: function() {
		var r = Math.random();
		if (r < 0.25) {
			return GE_NORTH;
		} else if (r < 0.50) {
			return GE_EAST;
		} else if (r < 0.75) {
			return GE_SOUTH;
		} else {
			return GE_WEST;
		}
	},
	getMap: function() {
		return this.parent.parent.parent.map;
	},
	
	getFriends: function(f) {
		var map = this.getMap();
		var col = this.parent.parent.col;
		var row = this.parent.parent.row;
		var tile;
		//ShoGE.w("getFriends");
		if (tile = map.get(col, row - 1)) {
			//ShoGE.w("Adding north friends");
			f[GE_NORTH] = tile;
		} else if (tile = map.get(col + 1, row)) {
			f[GE_EAST] = tile;
		} else if (tile = map.get(col , row + 1)) {
			f[GE_SOUTH] = tile;
		} else if (tile = map.get(col - 1, row)){
			f[GE_WEST] = tile;
		} else {
			return false;
		}
		return true;
	},
	
	bestHop: function(last) {
		//ShoGE.w("Best hop");
		var f = new Array();
		var map = this.getMap();
		var col = this.parent.parent.col;
		var row = this.parent.parent.row;
		var tile;
		var min = null;
		var tile = null;
		var card;
		//ShoGE.w("col: " + col + ", row : " + row);
		
		var i;
		for(i=0; i < this.parent.parent.friends.length; i++) {
			//if (i == last) { ShoGE.w("No " + last); continue;}
			var f = this.parent.parent.friends[i];
			if (!f) continue;
			var fG = f.getG();
			if (!tile || (fG <= min)) {
				tile = f;
				min = fG;
				card = i;
			}
		}
		if (!tile) return null;
		var hop = new Object();
		hop.tile = tile;
		hop.min;
		hop.card = card;
		return hop;
	},
	
	update: function($super, dt) {
		
		this.totalDt+=dt;
		var step = 20;
		if (this.totalDt < step) {
			return;
		}
		this.totalDt -= 20;

		var map = this.getMap();
		
		var tile = map.get(this.parent.parent.col, this.parent.parent.row);
		if (!tile) {
			ShoGE.w("No tile");
		}

		if (!this.parent.parent.parent.Walker.moveCardinal(this.parent, this.parent.getCardinalDirection())) {

				this.parent.setCardinalDirection (this.randomDirection());

		}
		
		if (this.parent.Animation) {
			this.parent.Animation.setCurrent("walk_" + this.parent.getCardinalDirection());
		}

	}
});




var GeEntity_Box = Class.create(GeEntity, {
	
	initialize: function($super, parent, width) 
	{
		$super(parent);
		var w = width/2;
		this.setU(w, 0, 0);
		this.setV(0, w, 0);
		this.enable('physic');
		this.enable('canvas', new GeDrawBox(this, '#f00', '#f00'));
	},
	
	_init: function(parent) 
	{
		this.set_type("entity");
		this.set_subtype("box");
	
	},
	__supdate: function($super, dt) 
	{

	}
});





var GeEntity_Player = Class.create(GeEntity_Creature, {

	initialize: function($super, parent, width) 
	{
		$super(parent, width);
		this.enable('canvas', new GeDrawBox(this, '#00f', '#0ff'));
		this.enable('ai', new GeMapAI(this));
		this.Animation = new GeEntityAnimation(this);
		this.setU(width/2, 0,0);
		this.setV(0,width/2,0);
	},

	update: function($super, dt) {
		ShoGE.w("Update");
		if (this.Anim) this.Anim.update(dt);
		$super(dt);
	},
});

var GeDrawAnimation = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
	},
	
	draw: function(renderer) 
	{
		var  ctx = renderer.getContext(GE_LAYER_MOVING);
		var img = this.parent.Animation.getCurrent();
		if (img) {
			var can = img.getCanvas();//ShoGE.Core.Player.Anim.getImage();
			//ctx.fillStyle = 'rgba(255,0,0,1)';
			//ctx.fillRect(0,0, 64, 32);
			ctx.drawImage(can, 0,0, this.parent.u.getX()*2, this.parent.v.getY()*2);	
		}
	}
	
});



var GeEntity_Monster = Class.create(GeEntity_Creature, {

	initialize: function($super, parent, width) 
	{
		$super(parent, width);
		this.enable('canvas', new GeDrawBox(this, '#ac4', '#0ff'));
		this.enable('ai', new GeMapAI(this));
	}
});
