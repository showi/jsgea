var GeDrawTile = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
	},

	draw: function(renderer) 
	{
		this.drawIso(renderer);
	},

	drawIso: function (renderer) 
	{
		var ctx = renderer.getContext(GE_LAYER_MOVING); // We have to draw the map
		var can;
		if (this.parent.isWalkable()) {
			//ShoGE.w("SubType: " + this.parent.getSubType());
			if (this.parent.getSubType() == GE_WATER) {
				can = ShoGE.Core.TilesetPool.get("iso-64x64-outside.png").getTile("water").getCanvas();
			} else if (this.parent.getSubType()  == GE_GRASS) {
				can = ShoGE.Core.TilesetPool.get("iso-64x64-outside.png").getTile("grass").getCanvas();
			} else {
				can = ShoGE.Core.TilesetPool.get("iso-64x64-outside.png").getTile("ground").getCanvas();
			}
		} else {
			can = ShoGE.Core.TilesetPool.get("iso-64x64-outside.png").getTile("wall").getCanvas();
		}
		if (!can) throw("No tileset found");
		ctx.drawImage(can, 0, 0, ShoGE.Core.tileWidth,ShoGE.Core.tileHeight);
	},
	
});



var GeTile = Class.create(GeEntity, {
	
	initialize: function($super, parent, id, col, row, width) {
		$super(parent);
		this.setClassName('GeTile');
		this.setType("tile");
		var w = width / 2;
		this.setU(w, 0, 0);
		this.setV(0, w, 0);
		this.setG(0);
		this.row = row;
		this.col = col;
		this.id = id;
		// ISO POSITION
		//var x = Math.round((col - row) * w);
		//var y = Math.round(((col + row) ) * w/2);
		this.setPosition(col , row);
		
		//this.NormalPosition = new GeVector3D(0, 0);
		this.setWalkable(false);
		this.enable('childs');
		this.enable('canvas', new GeDrawTile(this));
		this.layers = new Array();
		this.friends = new Array();
	},
	
	setFriends: function() {
		var x = this.col;
		var y = this.row;
		var tile;
		tile = this.parent.map.get(x       , y - 1);
		this.friends[GE_N] = tile;
		tile = this.parent.map.get(x + 1, y);
		this.friends[GE_E] = tile;
		tile = this.parent.map.get(x      , y + 1);
		this.friends[GE_S] = tile;
		tile = this.parent.map.get(x - 1 , y);
		this.friends[GE_W] = tile;
		
		tile = this.parent.map.get(x + 1 , y - 1);
		this.friends[GE_NE] = tile;
		tile = this.parent.map.get(x + 1, y + 1);
		this.friends[GE_SE] = tile;
		tile = this.parent.map.get(x - 1 , y + 1);
		this.friends[GE_SW] = tile;				
		tile = this.parent.map.get(x - 1 , y - 1);
		this.friends[GE_NW] = tile;						
				
	},
	
	
	
	_goCard: function(tag, depth, card) {
		
			if (this.tag == tag) { return; };
			//this.tag = tag;
			if (depth < 0) return;
			var t = this.friends[card];
			if (!t) return;
			var d;
			if (!t.isWalkable()) {
				d = -1;
			} else {
				d = depth--;
			}
			var i;
			//for(i = 0; i < t.friends.length; i++) {
				//if (card == i) continue;
				t._goCard(tag,d, card);
				t.tag = tag;
				
				
			//}
	},
	
	_goNcard: function (tag, depth, card) {
		for(i = 0; i < this.friends.length; i++) {
			if (i == card) continue;
			this._goCard(tag, depth, i);
		}
	},

	drawFromMe: function(tag, depth,card) {
		//ShoGE.w("tag: " + tag);
		if (this.tag == tag) {
			return false; // already visisted
		}	

		//var t = this.friends[card];
		//if (!t) return;		
		//t.tag = tag;
		if (depth < 0) {
			return false;
		}
		//depth--;
		this._goNcard(tag,depth, GE_N);
	
		this.tag = tag;
		return true;
	},
	
	setG: function(v) {
		this.g = v;
	},
	
	getG: function() {
		return this.g;
	},
	
	getRow: function() {
		return this.row;
	},
	
	getCol: function() {
		return this.col;
	},
	
	addLayer: function(layer) {
	
		this.layers.push(layer);
		this.setNeedRedraw(true);
	},
	
	setWalkable: function(b) 
	{
		this.walkable = b;
	},
	
	isWalkable: function() 
	{
		return this.walkable;
	},
	
	isLoaded: function() 
	{
		return this.loaded;
	},
	
	getImage: function() 
	{
		return ShoGE.Core.Images.get(this.src);
	},
	
	addBorder: function(cardinal) 
	{
		switch(cardinal) {
		
		case GE_NORTH:
			var path = "tiles/tile-64x64-border-north.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case  GE_SOUTH:
			var path = "tiles/tile-64x64-border-south.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case GE_EAST:
			var path = "tiles/tile-64x64-border-east.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
			
		case GE_WEST: 
			var path = "tiles/tile-64x64-border-west.png";
			ShoGE.Core.Images.add(path);
			this.addLayer(path);
			break;
		
		default:
			throw("Unknow cardinal border '"+cardinal+"'");
		}
	},
	hasFriend: function(cardinal, callback) 
	{
		if (cardinal == GE_NORTH) {
			if ( 0 >= (this.row - 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col, this.row - 1);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_SOUTH) {
			if ( this.parent.height <= (this.row + 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col, this.row + 1);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_EAST) {
			if ( this.parent.width <= (this.col + 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col + 1, this.row);
			if (callback(this, ft)) {
			}
			return 1;
		} 	else if (cardinal == GE_WEST) {
			if ( 0 >= (this.col - 1)) {
				return null;
			}
			var ft = this.parent.map.get(this.col - 1, this.row);
			if (callback(this, ft)) {
			}
			return 1;
		}
		return 0;
	},
	
});

/*
var GeTilePool = Class.create(GeObject, {

	initialize: function($super, parent) 
	{
		$super(parent);
		this.pool = new Hash();
	},
	
	add: function(id, tile) 
	{
		if (!(tile instanceof GeTile)) {
			throw("ERROR_TILEPOOL_ADD_BADINSTANCE");
			return null;
		}
		var tile;
		if (tile = this.pool.get(id)) {
			throw("ERROR_TILEPOOL_ADD_SAMEID");
			return null;
		}
		this.pool.set(id, tile);
	},
	
	get: function(id) 
	{
		return this.pool.get(id);
	},
	
});*/