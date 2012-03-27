var GeTile = Class.create(GeObject, {
	initialize: function($super, parent) {
		$super(parent);
		this.walkable = 0;
		this.name = "";
	},
	set_name: function(name) {
		this.name = name;
	},
	get_name: function() {
		return this.name;
	},
	set_walkable: function(bool) {
		this.walkable = bool;
	},
	is_walkable: function() {
		return this.walkable;
	}
});

var GeTreeNode_Cell = Class.create(GeTreeNode, {

	initialize: function($super, parent, x, y, cell_size, tile_size) {
		$super(parent);
		this.x = x;
		this.y = y;
		this.cell_size = cell_size;
		this.tile_size = tile_size;
		
		this.tiles = new GeArray2D(this.cell_size, this.cell_size);
		//alert(this.x + ", " + this.y);
		//this.is_loaded = false;
		//this.load();
	},

	_init: function(parent) {
		this.type = "cell";
		this.gx = new GeGx_Cell(this);
		this.unhide();
	},

	
	load: function(canvas) {
		var ctx = canvas.getContext('2d');
		var d = ctx.getImageData(0,0, canvas.width, canvas.height);
		var msg = "";
		for (var row = 0; row < canvas.height; row++) {
			for (var col = 0; col < canvas.width; col++) {
				var step = (row * d.width*4) + (col *4);
				var r = d.data[step];
				var g = d.data[step + 1];
				var b = d.data[step + 2];
				var a = d.data[step + 3];
				var tile = new GeTile(parent);
				
				if (a == 255) {
					msg += "#";
					tile.set_name("img/tile-on.png");
					tile.set_walkable(false);
				} else {
					tile.set_name("img/tile-off.png");
					tile.set_walkable(true);
					msg += " ";
				}
				//ShoGE.w("Set " + col + ", " + row + ": " + tile.get_name());
				ShoGE.Core.Images.add(tile.get_name());
				this.tiles.set(col, row, tile);
			}
			msg += "\n";
		}
		//ShoGE.w(msg);
		for (var row = 0; row < canvas.height; row++) {
			for (var col = 0; col < canvas.width; col++) {
				//ShoGE.w("Tile(" + col + ", " + row + ") = " + this.tiles.get(col, row).get_name());
			}
		}
	},
	load_shadow_info: function() {
		//this.tiles = new Array();
		var canvas = document.createElement('canvas');
		canvas.width = ShoGE.Core.Level.cell_size;
		canvas.height = ShoGE.Core.Level.cell_size;
		var c = canvas.getContext('2d');
		c.width = this.img_shadow.width;
		c.height = this.img_shadow.height;
		c.drawImage(this.img_shadow, 0, 0);
		var id = c.getImageData(0,0,ShoGE.Core.Level.cell_size,ShoGE.Core.Level.cell_size);
		//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 		var l = id.data.length / 4;
		var msg = "";
		this.tiles = new Array();
		var c = 0;
		
		for(var row = 0; row < 32; row++) {
			for (var i = 0; i < 32; i++) {
				var step = (row *(id.width*4)) + (i*4) ;
				var r = id.data[step];
				var g = id.data[step + 1];
				var b = id.data[step + 2];
				var a = id.data[step + 3];
				// alert(r + " " + g + " " + b + " " + a);
				var tile = new GeTile(parent);
				if (!a) {
					tile.walkable = 1;
					tile.name = "tile-" + r + "-" + g + "-" + b + ".png";
					tile.name = "tile-off.png";
					ShoGE.Core.Images.add(tile.name);
					
				} else {
					tile.walkable = 0;
					tile.name = "tile-on.png";
					ShoGE.Core.Images.add(tile.name);
				}			  
				this.tiles[row*32+i] = tile;
			}
		}
	},
	load_tile_info: function() {
		//this.tiles = new Array();
		var canvas = document.createElement('canvas');
		canvas.width = ShoGE.Core.Level.cell_size;
		canvas.height = ShoGE.Core.Level.cell_size;
		var c = canvas.getContext('2d');
		c.width = this.img_tile.width;
		c.height = this.img_tile.height;
		c.drawImage(this.img_tile, 0, 0);
		var id = c.getImageData(0,0,ShoGE.Core.Level.cell_size,ShoGE.Core.Level.cell_size);
		//netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
 		var l = id.data.length / 4;
		var msg = "";
		//this.tiles = new Array();
		var c = 0;
		
		for(var row = 0; row < 32; row++) {
	    	for (var i = 0; i < 32; i++) {
			  var step = (row *(id.width*4)) + (i*4) ;
	    	  var r = id.data[step];
	    	  var g = id.data[step + 1];
	    	  var b = id.data[step + 2];
			  var a = id.data[step + 3];
			  //alert(r + " " + g + " " + b + " " + a);
			  var tile;
				if (this.tiles[row*32+i]) {
					tile = this.tiles[row*32+i];
					
				} else {
					tile = new GeTile(parent);
					this.tiles[row*32+i] = tile;	
			}
			  if (a == 0) {
					//tile.walkable = 0;
					/*
					tile.name = "tile-" + r + "-" + g + "-" + b + ".png";
					ShoGE.Core.Images.add(tile.name);
					ShoGE.Core.Images.add("tile-on.png");*/
				} else {
					//tile.walkable = 1;
					tile.name = "tile-" + r + "-" + g + "-" + b + ".png";
					ShoGE.Core.Images.add(tile.name);
				}			  

			}
		}
	},
	
	loaded: function(type) {
		this.is_loaded = true;
		if (type == 'shadow') {
			this.load_shadow_info();
		}
		if (type == 'layer') {
			this.load_tile_info();
		}
	},
	
	get_level_path: function() {
		return "level/" + ShoGE.Core.Level.path + "/";
	},
	
	get_cell_path: function(x, y) {
		return "cells/" + x + "-" + y + "-";
	},
	
	load_old: function() {
		this.is_loaded = false;
		this.img_shadow = new Image();
		this.img_tile = new Image();
		var that = this;
		var src = this.get_level_path() + this.get_cell_path(this.x, this.y) + "shadow.png";
		ShoGE.Core.Images.add("../../" + src);
		this.img_shadow.onload = function() { that.loaded('shadow'); }	
		this.img_shadow.src = src;
		src = this.get_level_path() + this.get_cell_path(this.x, this.y) + "layer-0.png";
		ShoGE.Core.Images.add("../../" + src);
		//this.img_tile.onload = function() { that.loaded('layer'); }	
		this.img_tile.src = src;
	},
	
	preload_ressources: function($super) {
		ShoGE.Core.Images.add("tile-on.png");
		ShoGE.Core.Images.add("tile-off.png");
		$super();
	},
});

var GeGx_Cell = Class.create({

    initialize: function(parent) {
		this.parent = parent;
    },

    draw: function(ctx) {
		if (!this.parent.tiles) {
			return;
		}
		if (!this.cache) {
			this.cache = document.createElement('canvas');
			this.cache.width = this.parent.cell_size * this.parent.tile_size;
			this.cache.height = this.parent.cell_size * this.parent.tile_size;
			var lctx = this.cache.getContext('2d');
			lctx.save();
			for(var r = 0; r < this.parent.cell_size; r++) {
				for(var c = 0; c < this.parent.cell_size; c++) {
					lctx.save();
					lctx.translate(c*this.parent.tile_size, r*this.parent.tile_size);
					var ct = this.parent.tiles.get(c, r);
					//ShoGE.w(c + ", " + r + ": " + ct.get_name());
					lctx.drawImage(ShoGE.Core.Images.get(ct.get_name()).get(), 0,0);
					lctx.restore();
				}	
			}
			lctx.restore();
		}
		ctx.translate(
			this.parent.x * this.parent.cell_size * this.parent.tile_size, 
			this.parent.y * this.parent.cell_size * this.parent.tile_size
		);
		ctx.drawImage(this.cache, 0,0);
	},
});
