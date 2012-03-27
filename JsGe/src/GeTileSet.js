var GE_ROW= 0;
var GE_COL = 1;

var GeTilesetPool = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
		this.setClassName('GeTilesetPool');
		this.pool = new Hash();
	},
	
	add: function(name) 
	{
		var ts;
		if (ts = this.pool.get(name)) {
			throw("Tileset named " + name + " already defined");
		}
		ts = new GeTileSet(this, name);
		if (!ts) {
			throw ("Cannot create tileset " + name);
		} else {
			this.pool.set(name, ts);
		}
		return ts;
	},
	
	get: function(name) 
	{
		return this.pool.get(name);
	}

});

var GeTileSet_AnimWalker = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
		this.setClassName('GeTileSet_AnimWalker');
		this.frame = this.parent.fStart;
		this.dt = 0;
		this.lastUpdate = Date.now();
		this.interval = 180;
	},
	
	update: function(dt) 
	{
		this.dt += dt;
		if (this.dt < this.interval) {
			return;
		}
		this.dt = this.dt - this.interval;
		if (this.frame >= this.parent.fStop) {
			this.frame = this.parent.fStart;
		} else {
			this.frame++;
		}
	},
	
	getCanvas: function() 
	{
		var sx, sy;
		if (this.parent.cor == GE_ROW) {
			sx = this.parent.fStart + this.frame * this.parent.fw + this.parent.sx * this.parent.fw;
			sy = this.parent.sy * this.parent.fh;
		} else {
		    throw("Invalid parent coordinate type");
		}
		return this.parent.parent.getCanvas(sx, sy, this.parent.fw, this.parent.fh);
	},
	
	reset: function() 
	{
		this.frame = this.parent.fStart;
	},

});

var GeTileSet_Tile = Class.create(GeObject, {
	
	initialize: function($super, parent, name,  sx, sy, tw, th) 
	{
		$super(parent);
		this.setClassName('GeTileSet_Tile');
		this.sx = sx;
		this.sy = sy;
		this.tw = tw;
		this.th = th;
		this.name = name;
		this.canvas = null;
	},
	
	getCanvas: function() 
	{
		if (!this.canvas) 
			this.canvas = this.parent.getCanvas(this.sx*this.tw, this.sy*this.th, this.tw, this.th);
		return this.canvas;
	}

});

var GeTileSet_Anim = Class.create(GeObject, {
	
	initialize: function($super, parent, name, cor, sx, sy, fw,fh,fNum) 
	{
		$super(parent);
		this.setClassName('GeTileSet_Anim');
		this.cor = cor;
		this.sx = sx;
		this.sy = sy;
		this.fw = fw;
		this.fh = fh;
		this.fStart = 0;
		this.fStop = fNum;
		this.fnum = this.fStop - this.fStart;
		this.setName(name);
	},
	
	setName: function(v) 
	{
		this.name = v;
		//var that = this;
	},
	
	getWalker: function()
	{
		return new GeTileSet_AnimWalker(this);
	},
	
});

var GeTileSet = Class.create(GeObject, {
	
	initialize: function($super, parent, name) 
	{
		$super(parent);
		this.setClassName('GeTileSet');
		this.setType('tileset');
		this.setName(name);
		this.setLoaded(false);
		this.anims = new Hash();
		this.tiles = new Hash();
	},
	
	setName: function(v) 
	{
		this.name = v;
		var that = this;
		ShoGE.Core.Images.add(this.name, function() {
			ShoGE.w("TileSet loaded : " + that.name, that);
			that.setLoaded(true);
		});
	},
	
	setLoaded: function(b) {
		this.bLoaded = b;
	},
	
	addAnim: function(name, cor , sx, sy, fw, fh, fStart, fStop) {
		var a = new GeTileSet_Anim(this, name, cor, sx, sy, fw, fh, fStart, fStop);
		if (a) {
			ShoGE.w("Animation " + name + " added", this);
			this.anims.set(name, a);
		} else {
			throw("Cannot add anim: " + name);
		}
	},
	
	getAnim: function(name) 
	{
		return this.anims.get(name);
	},
	
	addTile: function(name, sx, sy, tw, th) 
	{
		if (!name) {
			throw("Cannot add tile without name");
		}
		var t = this.tiles.get(name);
		if (t) {
			throw("Tile with this name already present in tileset");
		}
		ShoGE.w("Adding tile named " + name + " for tileset '" + this.name + "' ", this);
		this.tiles.set(name, new GeTileSet_Tile(this, name, sx, sy, tw, th));
		return t;
	},
	
	getTile: function(name) 
	{
		var t = this.tiles.get(name);
		if (!t) throw("Cannot get tile named: " + name);
		return t;
	},
	
	getCanvas: function(sx, sy, tw, th) 
	{
		var c = document.createElement('canvas');
		c.width = tw;
		c.height = th;
		var ctx = c.getContext('2d');
		ctx.drawImage(ShoGE.Core.Images.get(this.name).asCanvas(), sx, sy, tw, th, 0, 0, tw, th);
		return c;
	},
}); 