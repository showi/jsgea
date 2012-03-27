var GeTreeNode_Grid = Class.create(GeTreeNode, {
	
	initialize: function($super, parent, width, height, cell_size, tile_size, src) {
		this.set_src(src);
		this.set_width(width);
		this.set_height(height);
		this.set_cell_size(cell_size);
		this.set_tile_size(tile_size);
		$super(parent);
	},
	set_src: function(src) {
		this.src = src;
	},
	
	get_src: function() {
		return this.src;
	},
	
	set_width: function(w) {
		this.width = w;
	},
	
	get_width: function() {
		return this.width;
	},
	
	set_height: function(h) {
		this.height = h;
	},
	
	get_height: function() {
		return this.height;
	},	
	set_cell_size: function(size) {
		this.cell_size = size;
	},
	
	get_cell_size: function() {
		return this.cell_size;
	},
	
	set_tile_size: function(size) {
		this.tile_size = size;
	},
	
	get_tile_size: function() {
		return this.tile_size;
	},
	
	_init: function(parent) {
		this.type = "grid";
		this.grid = new GeArray2D(this.width, this.height);
	},
	
	get: function(x, y) {
		return this.grid.get(x, y);
	},
	
	set: function(x, y, cell) {
		cell.x = x;
		cell.y = y;
		this.grid.set(x, y, cell);
		this.add_child(cell);
	},
	
	load: function() {
		ShoGE.w("Grid: loading " + this.src);
		var simg = ShoGE.Core.Images.get(this.src).get();
		var c = document.createElement('canvas');
		c.width = simg.width;
		c.height = simg.height;
		var row, col;
		for (row = 0; row < this.height; row++) {
			for (col = 0; col < this.width; col++) {
				var c2 = document.createElement('canvas');
				c2.width = this.cell_size;
				c2.height = this.cell_size;
				var ctx2 = c2.getContext('2d');
				/*var sx = col * this.cell_size;
				var sy = row * this.cells_size;
				var ex = 10;
				var ey = 10;*/
				//alert(sx + ", " + sy + ", " + ex + ", " + ey);
				//var data = ctx.getImageData(sx, sy, ex, ey);
				//alert(col + ", " + row + ", " + this.cell_size);
				ctx2.drawImage(simg, 
					col * this.cell_size, 
					row* this.cell_size, 
					this.cell_size, 
					this.cell_size,
													0, 0, this.cell_size, this.cell_size);
				var cell = new GeTreeNode_Cell(this, col, row, this.cell_size, this.tile_size);
				//ShoGE.w("Loading cell: " + col + ", " + row);
				cell.load(c2);
				this.set(col, row, cell);
				//return;
			}
		}
		$('GameDebug').appendChild(c2);

	},
	
	add: function(node) {
		var x = Math.round(node.phys.pos.x / this.cell_width);
		var y = Math.round(node.phys.pos.y / this.cell_height);
		//alert(x + ", " + y);
		var cell = this.get(x, y)
		//if (cell) 
		cell.add_child(node);
	},
	
	replace: function(node) {
		if (!node.bound || !node.bound.grid) {
			return;
		}
		var ccell = node.get_parent('cell');
		if (!ccell) { 
			//ShoGE.w("Node " + this.type + "not in cell"); 
			return; 
		}
		var x = Math.round(node.x / this.cell_size);
		var y = Math.round(node.y / this.cell_size);
		var ccell = node.get_parent('cell');
		if (ccell.x == x && ccell.y == y) {
			return;
		}
		var ncell;
		if (ncell = this.get(x, y)) {
			ccell.childs.remove(node);
			ncell.add_child(node);
		}
	},
	
	preload_ressources: function() {
		var that = this;
		ShoGE.Core.Images.add(this.src, function() { that.load()});
	},
});
