var GePathFindingA_Node = Class.create(GeObject, {
	initialize: function($super, parent, x, y, g, h) {
		$super(parent);
		this.setX(x);
		this.setY(y);
		this.setG(g);
		this.setH(h);
		this.setClose();
	},
	equal: function(b) {
		if (this.x != b.x) {
			return false;
		} 
		if (this.y != b.y) {
			return false;
		}
		
		return true;
	},
	setClose: function() {
		this.bOpen = false;
	},
	
	setOpen: function() {
		this.bOpen = true;
	},
		
	isOpen: function() {
		return this.bOpen;
	},
	
	setX: function(v) {
		this.x = v;
	},
	setY: function(v) {
		this.y = v;
	},
	/*setF: function(v) {
		this.f = v;
	},*/
	setG: function(v) {
		this.g = v;
	},
	setH: function(v) {
		this.h = v;
	},
	getX: function() {
		return this.x;
	},
	getY: function() {
		return this.y;
	},
	getG: function() {
		return this.g;
	},
	getH: function() {
		return this.h;
	},
	getF: function() {
		return this.g + this.h;
	},
	prettyPrint: function($super) {
		var msg = "";//$super();
		msg += "\n[PathFindingNode] x:" + this.x + ", y: " + this.y + ",  f:" + this.f + ", g: " + this.g + "\n";
		return msg;
	},
});

var GeDrawPathFindingA = Class.create(GeObject, {
	
	initialize: function($super, parent) 
	{
		$super(parent);

	},
	
	draw_itinary: function(ctx, node) {
			//var n = node;
			while (node) {
				this.draw_node(ctx, node, 'rgba(0,0,255,0.8)');
				node = node.parent;
				//ShoGE.w('has parent');
			}
	},
	
	draw_node: function(ctx, node, fill1, stroke1) {
		var A = new GeVector3D(0,0,0).sub(this.parent.u).sub(this.parent.v);
		var C = new GeVector3D(0,0,0).add(this.parent.u).add(this.parent.v);
			
			
			if (node.isOpen() ){
			ctx.fillStyle = fill1 || 'rgba(0,200,0,0.6)';
			ctx.strokeStyle = stroke1 || 'rgba(200,0,0,0.8)';
			
			} else {
				ctx.fillStyle = fill1 || 'rgba(200,0,0,0.6)';
				ctx.strokeStyle = stroke1 || 'rgba(200,0,0,0.8)';
			}
			ctx.save();
			var dw = this.parent.map.tileWidth/2;
			ctx.translate(node.x * dw, node.y * dw);
			ctx.fillRect(A.getX(), A.getY(), C.getX(), C.getY());	
			ctx.strokeRect(A.getX(), A.getY(), C.getX(), C.getY());
			ctx.restore();
	
	},
	draw: function(renderer, position) 
	{
		if (!this.parent.nodes) {
			return false;
		}
		var ctx = renderer.getContext(GE_LAYER_GROUND);
		var dw = this.parent.map.tileWidth;
		ctx.translate(dw, dw);
		var max = this.parent.nodes.width * this.parent.nodes.height;
		for (var i = 0; i < max; i++) {
			var node = this.parent.nodes.get(i, 0);
			if (!node) {
				continue;
			}
			this.draw_node(ctx, node);
		}
		if (this.parent.end.parent) {
			this.draw_itinary(ctx, this.parent.end);
		} else {
			//ShoGE.w("Draw from current");
			this.draw_itinary(ctx, this.parent.current);
		
		}
	},
});

var GePathFindingA = Class.create(GeEntity, {
	
	initialize: function($super, parent, map) {
		$super(parent);
		this.map = map;
		this.enable('canvas', new  GeDrawPathFindingA(this));
		var dw = this.map.tileWidth/2;
		this.setU(dw, 0);
		this.setV(0,dw);
		//this.start = new GeVector3D(0,0,0);
	//	ths.
	},
	
	initList: function() {
		this.nodes = new GeArray2D(this.map.width, this.map.height);
	},
	
	path: function(sX, sY, eX, eY) {
		var tS, tE;
		tS = this.map.map.get(sX, sY);
		tE = this.map.map.get(eX, eY);
		if (!tS || !tE) {
			throw("No valid tile for start and destination");
		}
		if (sX == eX && sY == eY) {
			return new GePathFindingA_Node(null, sX, sY, 0, 0);
		}
		//this.setStart(sX, sY);
		//this.setEnd(eX, eY);
		this.initList();
		this.calcPass = 0;
		//this.start = new GePathFindingA_Node(null, sX, sY),
		//this.open.add(
		this.start = new GePathFindingA_Node(null, sX, sY, 0, 0);
		this.end = new GePathFindingA_Node(null, eX, eY, 0, 0);
		this.current = this.start;
		this.tte = 0;
		return this._calc_path();
	},
	
	manathan: function(sX, sY, eX, eY) {
		return ((Math.abs(eX - sX + 1) + Math.abs(eY - sY + 1)) * 10);
	},
	
	_add_friends: function(node, x, y, g , friends, card) {
		
		var tile;
		if (!(tile = this.map.map.get(x , y))) {
			return false;
		}
		
		if (!tile.isWalkable()) {
			return false;
		}
		/*
		if (tile.type == 'water') {
			g=40;
		} else if (tile.type == 'deepWater') {
			g=60;
		}*/
		g+=tile.g;
		var fn = this.nodes.get(x, y);
		if (fn) {
			if (!fn.isOpen()) {
				return false;
			}
			var fnG = fn.getG();
			if ((g + 10)< fnG) {
				fn.setParent(node);
				fn.setG(g + 10);
			}
		} else {
			fn = new GePathFindingA_Node(node, x, y, g, this.manathan(x, y, this.end.x, this.end.y));
			this.nodes.set(x, y, fn);
			fn.setOpen();
		}
		friends.add(fn);
		return true;
	},

	addFriendsCW: function(node, friends) {
		var x, y;
		
		var tile;
		if (!(tile = this.map.map.get(node.x , node.y))) {
			return false;
		}

		/*if (tile.type == 'water') {
			g=40;
		} else if (tile.type == 'deepWater') {
			g=60;
		}*/
		x = node.x;
		y = node.y;
			//ShoGE.w("Searching friends");
		this._add_friends(node, x, y -1, tile.g + 10, friends, GE_N); // North
		this._add_friends(node, x + 1, y,tile.g +  10, friends, GE_E); // EAST
		this._add_friends(node, x, y + 1,tile.g +  10, friends, GE_S); // SOUTH
		this._add_friends(node, x - 1, y,tile.g +  10, friends, GE_W); // WEST
			
		this._add_friends(node, x + 1, y -1,tile.g +  14, friends, GE_NE); // North - EAST
		this._add_friends(node, x + 1, y + 1, tile.g + 14, friends, GE_SE); // SOUTH EAST
		this._add_friends(node, x - 1, y + 1,tile.g +  14, friends, GE_SW); // WEST - SOUTH
		this._add_friends(node, x - 1, y - 1,tile.g +  14, friends, GE_NW); // NORTH - West			
	},

	addFriendsACW: function(node, friends) {
			var x, y;

					var tile;
		if (!(tile = this.map.map.get(node.x , node.y))) {
			return false;
		}
		//var g = 0;
		if (tile.type == 'water') {
			g=40;
		} else if (tile.type == 'deepWater') {
			g=60;
		}
			x = node.x;
			y = node.y;
			//ShoGE.w("Searching friends");

	
			this._add_friends(node, x, y + 1, 10, friends, GE_S); // SOUTH
			this._add_friends(node, x + 1, y, 10, friends, GE_E); // EAST
			this._add_friends(node, x, y -1, 10, friends, GE_N); // North	
			this._add_friends(node, x - 1, y, 10, friends, GE_W); // WEST
				
			this._add_friends(node, x + 1, y + 1, 14, friends, GE_SE); // SOUTH EAST				
			this._add_friends(node, x + 1, y -1, 14, friends, GE_NE); // North - EAST		
			this._add_friends(node, x - 1, y - 1, 14, friends, GE_NW); // NORTH - West
			this._add_friends(node, x - 1, y + 1, 14, friends, GE_SW); // WEST - SOUTH
	
	},
	_minF: function(friends) {
		var min = 1000000;
		var minNode = null;
		var it = friends.iterator();
		var node;
		while(node = it.next()) {
			if (node.data.equal(this.end)) {
				return node.data;
			}
			if (node.data.getF() < min) {
				min = node.data.getF();
				minNode = node.data;
			}
		}
		//ShoGE.w("Min: " + min);
		return minNode;
	},
	_calc_path: function() {
		var friends = new GeLinkedList();
		this.current.setOpen();
		this.nodes.set(this.current.x, this.current.y, this.current);
		var rand = Math.random();
		//if (this.calcPass == 0) {
		if (rand <= 0.5) {
			this.calcPass = 1;
			this.addFriendsCW(this.current, friends);	
		} else {
			this.calcPass = 0;
			this.addFriendsACW(this.current, friends);
		}
		
		this.current.setClose();
		this.current = this._minF(friends);
		if (!this.current) {
			if (this.tte < 3) {
			this.current = this.start;
			this.current.setOpen();
				this.tte++;
				this._calc_path();

			}
	
			return this.start;
		}
		if (this.current.equal(this.end)) {
			//ShoGE.w("Found destination");
			this.end = this.current;
			return this.start;
		}
		this._calc_path();
		//return friends.getTailItem();
		//_add_friends(this.current)
	},
	
	setStart: function(x, y) {
		this.start.set(x, y, 0);
	},
	
	setStop: function(x, y) {
		this.stop(x, y, 0);
	},
	
});