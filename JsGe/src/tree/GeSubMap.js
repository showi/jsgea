var GeSubMap = Class.create(GeEntity, {

	initialize: function($super, parent, path, id, width, height, tileWidth) 
	{
		$super(parent);
		this.setId(id);
		this.path = path;
		this.loaded = false;
		this.width = width;
		this.height = height;
		this.loading = 0;
		this.setTileWidth(tileWidth);
		this.loadFromBig = true;
		
		this.map = new GeArray2D(width, height);
		this.buffer = new GeImageBuffer(this, width, height);
		this.Walker = new GeSubMapWalker(this);
		
		this.setPosition(0, 0);

		this.enable('childs');
		this.enable('canvas', new GeSubMap_Draw(this));

		this.images = new Hash();
		this.buildFrom = new Hash();

		var that = this;
		this.buildFrom.set('shadow', function() { that.buildFromShadow(); });
		//this.buildFrom.set('creatures', function() { that.buildFromCreatures(); });
		//this.buildFrom.set('nature', function() { that.buildFromNature(); });

		this.loadLayer('shadow');	
	},
	
	setTileWidth: function(v) 
	{
		if (v == this.tileWidth) {
			return;
		}
		this.setNeedRedraw(true);
		this.tileWidth = v;
	},
	
	pointInMap: function(x, y) 
	{
		if (x < 0) return false;
		if (x > this.width) return false;
		if (y < 0 ) return false;
		if (y < this.height) return false;
		return true;
	},
	
	update: function(dt) 
	{
		var max = this.width * this.height;
		for (var i = 0; i < max; i++) {
			var tile = this.map.get(i, 0);
			if (tile) tile.update(dt);
		}
	},
		
	buildTileOverlay: function() 
	{
		ShoGE.w("Building tile overlay");
		for (var row = 0; row < this.height; row++) {
			for (var col = 0; col < this.width; col++) {
				var tile = this.map.get(col, row);
				if (!tile || tile.isWalkable()) 
				{
					continue;
				}
				tile.hasFriend(GE_SOUTH, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_SOUTH);
						return false;
					}
					return true;
				});
				tile.hasFriend(GE_NORTH, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_NORTH);
							return false;
					}
					return true;
				});
				tile.hasFriend(GE_EAST, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_EAST);
							return false;
					}
					return true;
				});
				tile.hasFriend(GE_WEST, function(p_tile, ft) {
					if (ft.isWalkable()) { 
							p_tile.addBorder(GE_WEST);
							return false;
					}
					return true;
				});
				
			}
		}
	},
	
	readImage: function(layer, callback , bCreate) 
	{
		var src = this.path + this.id + "-" + layer + ".png";
		var img = ShoGE.Core.Images.get(src);
		if (!img) {
			throw("Cannot load" + src + " from images pool!");
		}
		var canvas = img.as_canvas();
		var ctx = canvas.getContext('2d');
		var ti = 0;
		var d = ctx.getImageData(0,0, canvas.width, canvas.height);
		for (var row = 0; row < canvas.height; row++) {
			for (var col = 0; col < canvas.width; col++) {
				var step = (row * d.width*4) + (col *4);
				var r = d.data[step];
				var g = d.data[step + 1];
				var b = d.data[step + 2];
				var a = d.data[step + 3];
				var tile =  this.map.get(col, row);
				if (!tile) {
					if (!bCreate) {
						continue;
					}
					ti++;
					tile = new GeTile(this, col+"-"+row, col, row, this.tileWidth);		
					this.map.set(col,row, tile);
				}
				callback(this, tile, r, g, b ,a);
			}
		}
	},

	setTileProp: function(tile, st, g) 
	{
		tile.setType('tile', st);
		tile.setG(g);
	},
	
	buildFromNature: function() {
		ShoGE.w("Build from nature");
		this.readImage('nature', function(that, tile, r, g, b, a) {
			//ShoGE.w(r + '-' + g + '-' + b + '-' + a);
			if (a != 255) {
				ShoGE.w("No nature for this tile");
				return false;
			}
			if (r == 50 && g == 50 && b == 255) {
				that.setTileProp(tile, GE_WATER, GE_WATER_WEIGHT);
			} else if (r == 50 && g == 50 && b == 50) {
				that.setTileProp(tile, GE_DEEPWATER, GE_DEEPWATER_WEIGHT);
			}
			var src = ShoGE.Core.TileSprite.loadRGB(r, g, b);
			tile.addLayer(src);
			return true;
		});
	},
	
	removeTile: function() {
		var max = this.width * this.height;
	
		for (var i = 0; i < max; i++) {
			if (!this.map.data[i]) continue;
			//ShoGE.w("Set Friends");
			this.map.data[i].setFriends();
		}
		for (var i = 0; i < max; i++) {
			var tile = this.map.data[i];
			if (!tile) continue;
			var t = 0;
			var s;
			for (j = 0, s = tile.friends.length; j < s; j++) {
				if (!tile.friends[j]) {
					continue;
				} else if (!tile.friends[j].isWalkable()) {
					continue;
				}
				t++;
			}
			if (t) continue;
			this.map.data[i] = null;
		}
	},
	
	buildFromCreatures: function() {
		ShoGE.w("Build from creatures");
		this.readImage('creatures', function(that, tile, r, g, b, a) {
			if (r == 0 && g == 255 && b == 0) {
				ShoGE.w("Found monster (green) x: " + tile.col + " y: " + tile.row);
				var monster = new GeEntity_Monster(null, that.tileWidth);
				ShoGE.Core.Monster = monster;
				that.Walker.moveTo(monster, tile.col, tile.row);
			}
		});
	},
	
	buildFromShadow: function() {
		ShoGE.w("Building map " + this.name + " shadow layer");
		this.readImage('shadow', function(that, tile, r, g, b, a) {
			if (0 == r && 0 == g && 0 == b) {
				tile.setWalkable(false);
				that.setTileProp(tile, GE_WALL, GE_WALL_WEIGHT);
			} else if (160 == r && 129 == g && 55 == b) {
				tile.setWalkable(true);
				that.setTileProp(tile, GE_GROUND, GE_GROUND_WEIGHT);
			} else if (110 == r && 239 == g && 53 == b) {
				tile.setWalkable(true);
				that.setTileProp(tile, GE_GRASS, GE_GRASS_WEIGHT);
			} else if (50 == r && 50 == g && 255 == b) {
				tile.setWalkable(true);
				that.setTileProp(tile, GE_WATER, GE_WATER_WEIGHT);
			} else if (50 == r && 150 == g && 50 == b) {
				tile.setWalkable(true);
				that.setTileProp(tile, GE_FOREST, GE_FOREST_WEIGHT);
			} else {
				tile.setWalkable(false);
				that.setTileProp(tile, GE_WALL, GE_WALL_WEIGHT);
			}
		}, 1);	
		this.removeTile();
		},
	
	loadLayer: function(layer) {
		ShoGE.w("Layer:" + layer);
		var path = this.path + this.id + "-" + layer + ".png";
		var that = this;
		this.loading++;
		this.images.set(layer, ShoGE.Core.Images.add(path, function() {
			that.loading--;
			var meth = that.buildFrom.get(layer);
			if (!meth) {
				throw("No method to build layer '"+layer+"'");
				return false;
			}
			return meth();
		}));
	},
	
	setId: function(id) 
	{
		this.id = id;
	},
	
	getId: function() 
	{
		return this.id;
	},
	
	preload_ressources: function() {
		//this.loadLayer('nature');
		//this.loadLayer('creatures');
		//this.buildTileOverlay();
		
	},
	
});

var GeSubMap_Draw = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);
	},
	
	draw: function(renderer) 
	{	
			var numH = (renderer.Screen.width / this.parent.tileWidth);
			var numV = (renderer.Screen.height / this.parent.tileWidth/2);
			numH = 10;
			numV = 10;
			var position, col, row;
				 tile = renderer.Camera.tracked.parent;
			if (!tile) {
				 return;
			}
			var x = (tile.col - tile.row);
			var y = Math.round((tile.col + tile.row)/2) ;
			x = tile.col;
			y = tile.row;
			var p = new GeVector3D(x, y);
			var minX, maxX, minY, maxY;
			minX = p.getX() - numH;
			if (minX < 0) {
				minX = 0;
			}
			maxX = p.getX() + numH;
			if (maxX > this.parent.width) {
				maxX = this.parent.width;
			}
			minY = p.getY() - numV;
			if (minY < 0) {
				minY = 0;
			}
			maxY = p.getY() + numV;
			if (maxY > this.parent.height) {
				maxY = this.parent.height;
			}
			minX = Math.round(minX);
			maxX = Math.round(maxX);
			minY = Math.round(minY);
			maxY = Math.round(maxY);
			//renderer.save();
			//ShoGE.w("Draw minX: " + minX + ", minY: " + minY + ", maxX: " + maxX + ", maxY: " + maxY);
			
		
			this.drawIso(renderer, minX, minY, maxX, maxY);
			
			//this.drawCache(this.parent.buffer, minX, minY, maxX, maxY);
			//var ctx = renderer.getContext(1);
			//ctx.drawImage(this.parent.buffer.getCanvas(), 0,0);// this.parent.width*this.parent.tileWidth, this.parent.height*this.parent.tileWidth);
			//renderer.restore();	
	},
	
	drawIso: function(renderer, minX, minY, maxX, maxY) {
		var tagp1 = Math.random()*13453;
		//var tagp2 = Math.random()*1563;
		var tag = Date.now() + "-" + Math.round(tagp1);
		//renderer.Camera.tracked.parent.drawFromMe(tag , 1);		
		var row, col, i;

		for (row = minY; row < maxY; row++) {

		for (col = minX; col < maxX; col++) {
							var x = col - row;
							var y = Math.round((col + row ) /2);
							//ShoGE.w("col: " + col + ", row: " + row);
							var tile = this.parent.map.get(col, row);
							if (!tile) continue;
							//if (tile.tag != tag) continue;
							tile.draw(renderer);
				}
			}
	},
	
	drawCache: function(renderer, minX, minY, maxX, maxY) {
			var row, col, i;
			//ShoGE.w("Draw From: " + minX + " to " + maxX + " and From " + minY + " to " + maxY);
			for (col = minX; col < maxX; col++) {
			for (row = minY; row < maxY; row++) {
				
					this.parent.map.get(col, row).canvas.drawCache(this.parent.buffer);
				}
			}
	},
	
	drawMap1: function(renderer, minX, minY, maxX, maxY) {
			var row, col, i;
			//ShoGE.w("Draw From: " + minX + " to " + maxX + " and From " + minY + " to " + maxY);
			for (row = minY; row < maxY; row++) {
				for (col = minX; col < maxX; col++) {
					this.parent.map.get(col, row).draw(renderer);
				}
			}
	},
	drawMap2: function(renderer, minX, minY, maxX, maxY) {
		var MAX = maxX * maxY;
		for (var i = 0; i < MAX; i++) {
			var row = Math.floor(i / maxX);
			var col = i - row * maxX;
			this.parent.map.get(col, row).draw(renderer);
		}
	},
	drawMap3: function(renderer, minX, minY, maxX, maxY) {
		var MAX = minX + maxX * maxY;
		for (var i = minX; i < MAX; i++) {
			//var diz = 0;
			
			this.parent.map.data[i].draw(renderer);
		}
	},
});

