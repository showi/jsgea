var GeSubMapWalker = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		$super(parent);
	},
	
	addTo: function(entity, x, y) 
	{
		
	},
	getMapPosition: function(entity) 
	{
		var x = Math.round(entity.Position._A[GeX] + entity.parent.col*ShoGE.Core.tileHeight);
		var y = Math.round(entity.Position._A[GeY] *2 - x);
		ShoGE.w("x: " + x + ",y: " + y, this);
		return new GeVector3D(x, y, 0);
	},
	
	isWalkable: function(mapPos) 
	{
		var tile = this.parent.map.get(mapPos.getX(), mapPos.getY());
		if (!tile) {
			return null;
		}
		return tile.isWalkable();
	},
	
	moveTo: function(entity, x, y) 
	{
		//ShoGE.w("MoveTo x: " + x + ", y: " + y);
			var tile = this.parent.map.get(x, y);
			if (!tile) {
				//ShoGE.w("Cannot move there's no tile");
				return false;
			}
			if (!tile.isWalkable()) {
				//ShoGE.w("Cannot move to non walkable tile ");
				return false;
			}
			entity.Position.set(0,0);
			return this.associate(entity, tile);
	},
	
	associate: function(entity, tile) {
		if (entity.parent == tile) {
			ShoGE.w("Associate loop");
			return false;
		}
		if (entity.parent) {
			//ShoGE.w("Has parent, removing child");
			entity.parent.removeChild(entity);
		}
		//var dw = this.parent.tileWidth / 2;
		entity.parent = tile;
		//entity.Position.set(dw,dw);
		tile.addChild(entity);
		return true;
	},
	
	move: function(entity, d) 
	{
		ShoGE.w("Move");
		var pos;
		if (entity.parent ) {
			pos = entity.parent.Position.clone().add(d);
		} else {
			ShoGE.w("Warning: cannot walk no parent");//pos = entity.Position.clone().add(d);
			return false;
		}
		var mapPos = this.getMapPosition(pos);
		var tile;
		if (tile = this.parent.map.get(mapPos.getX(), mapPos.getY())) {
			if (!tile.isWalkable()) {
				ShoGE.w("Cannot move non walkable");
				return false;
			}
			ShoGE.w("Associate");
			this.associate(entity,tile);
			//entity.Position = pos;
			return true;
		} else {
			ShoGE.w("Cannot move");
		}
		return false;
	},
	
	moveCardinalWith: function(entity, cardinal,  amount) {
		if (!entity || !entity.parent) {
			throw("Entity without parent");
		}
		var nP = new GeVector3D(entity.parent.row*ShoGE.Core.tileWidth, entity.parent.col*ShoGE.Core.tileHeight);
		ShoGE.w("nP x: " + nP.getX() + ", y: " + nP.getY(), this);
		
		switch(cardinal) {
			case GE_NORTH:
				entity.setCardinalDirection(GE_N);
				//return this.moveTo(entity, col, row + 1);
				nP._A[GeY]+=amount;
			break;
			case GE_EAST:
				entity.setCardinalDirection(GE_E);
				//return this.moveTo(entity, col + 1, row);
				nP._A[GeX]+=amount;
			break;
			case GE_SOUTH:
				entity.setCardinalDirection(GE_S);
				//return this.moveTo(entity, col, row - 1);
				nP._A[GeY]-=amount;
			break;
			case GE_WEST:
				entity.setCardinalDirection(GE_W);
				//return this.moveTo(entity, col  - 1, row);
				nP._A[GeX]-=amount;
			break;
			default:
				throw("Unknow cardinal " + cardinal);
		}
		ShoGE.w("nP x: " + nP.getX() + ", y: " + nP.getY(), this);
		var tD = this.parent.map.get(this.getMapPosition(entity));
		if (!tD) {
			ShoGE.w("Cannot move, no destination tile", this);
			return;
		}
		var BA = new GeVector3D((entity.parent.col - tD.col)*ShoGE.Core.tileWidth, (entity.parent.row - tD.row)*ShoGE.Core.tileHeigtht, 0);
		BA.add(nP);
		this.Position = BA;
		this.moveTo(entity, x, y);
	},
	
	moveCardinal: function(entity, cardinal) {
		if (!entity || !entity.parent) {
			throw("Entity without parent");
		}
		var col = entity.parent.getCol();
		var row = entity.parent.getRow();
		ShoGE.w("moveCardinal col: " + col + ", " + row);
	
		var or;
		switch(cardinal) {
			case GE_NORTH:
				entity.setCardinalDirection(GE_N);
				return this.moveTo(entity, col, row + 1);
			break;
			case GE_EAST:
				entity.setCardinalDirection(GE_E);
				return this.moveTo(entity, col + 1, row);
			break;
			case GE_SOUTH:
				entity.setCardinalDirection(GE_S);
				return this.moveTo(entity, col, row - 1);
			break;
			case GE_WEST:
				entity.setCardinalDirection(GE_W);
				return this.moveTo(entity, col  - 1, row);
			break;
			default:
				return false;
		}
		return false;
	},
	
});

