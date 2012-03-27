var MtCore = Class.create(GeCore, {
	
	initialize: function($super, parent) {
		$super(parent);
	},
	
	init: function($super, width, height) 
	{
		$super(width, height);
		this.add_screen("GameScreen", width, height, "#f00");
		//this.set_mouse('GameScreen');
		var k = GeKeys;
		this.set_keyboard('GameScreen').set_keyfilter(
			new Array(k.LEFT, k.UP, k.RIGHT, k.DOWN, k.ESC, k.ENTER, k.SPACE)
		);
		
		this.add_screen("GameScreen", width, height);
	
		/* Create our renderers */
		this.add_renderer('GameScreen', this.Screens.get('GameScreen'), null, width, height);
		this.Images.path = "../../JsGe-2DMap/res/";
		
		//this.TileSprite = new GeTileSprite(this);
		this.tileWidth = 128;
		this.tileHeight = 128;

		this.Resources = new GeResource();
		//this.Resources.load("");
		
		this.TilesetPool = new GeTilesetPool(this);
		
		var ts = this.TilesetPool.add("img/skeleton_0.png");
		ts.addAnim("walk_" + GE_N, GE_ROW, 4, 7, 128, 128, 7);
		ts.addAnim("walk_" + GE_E, GE_ROW, 4, 5, 128, 128, 7);
		ts.addAnim("walk_" + GE_S, GE_ROW, 4, 3, 128, 128, 7);
		ts.addAnim("walk_" + GE_W, GE_ROW, 4, 1, 128, 128, 7);
	
		ts = this.TilesetPool.add("iso-64x64-outside.png");
		ts.addTile("ground", 2,  0, 64, 64);
		ts.addTile("grass",  4, 11, 64, 64);
		ts.addTile("wall",   4,  5, 64, 64);
		ts.addTile("water",  4,  8, 64, 64);
		
		this.Player = new GeEntity_Monster_Skeleton(null, this.tileWidth);
		this.Camera = new GeCamera(this, this.Player);
		this.get_renderer("GameScreen").set_camera(this.Camera);
	
		var smap = new GeSubMap(this, "", "mlvl01", 64, 64, this.tileWidth);
		smap.addChild(this.Player);
		
		this.SG = smap;
		this.load_ressources();	
		this.start();
	},
	
	load_ressources: function() 
	{
		this.ImageReady = new GeWaitLoading(parent, this.Screens.get('GameScreen'), this.Images);
		this.SG.preload_ressources();
	
	},
	
	hookPreStart: function($super) 
	{
		this.SG.Walker.moveTo(this.Player, 5, 5);
	},
	
	/* HTML update: Running in separate thread.*/
	html_update: function()
	{
		$('GameFPS').innerHTML = Math.round(this.Renderers.get('GameScreen').get_fps());
		$('GameElapsedTime').innerHTML = Math.round(this.DiscreteTime.t/10)/100 + "&nbsp;s";
		$('GameAlpha').innerHTML = this.DiscreteTime.alpha;
		if (this.Player.parent) {
		$('PlayerPosX').innerHTML = this.Player.parent.col;
		$('PlayerPosY').innerHTML = this.Player.parent.row;
		}
	},
	
	loop: function($super) 
	{
		var that = this;
		this.get_keyboard().scan(function(key) {
				if (key.is_active() || key.is_complete()) {
					if (key.keyCode == GeKeys.RIGHT) { 
						that.SG.Walker.moveCardinal(that.Player, GE_E, 0.2);
						that.Player.Animation.setCurrent('walk_' + GE_E)
					} else if (key.keyCode == GeKeys.LEFT) {   that.SG.Walker.moveCardinal(that.Player, GE_W, 0.2); 
						that.Player.Animation.setCurrent('walk_' + GE_W)
					}
					else if (key.keyCode == GeKeys.UP) {  that.SG.Walker.moveCardinal(that.Player, GE_S, 0.2);
					that.Player.Animation.setCurrent('walk_' + GE_S)
					}
					else if (key.keyCode == GeKeys.DOWN) { that.SG.Walker.moveCardinal(that.Player, GE_N, 0.2); 
					that.Player.Animation.setCurrent('walk_' + GE_N)
					}
					if (key.is_complete()) {
						key.reset();
					}
				}
		});
		$super();
	}

});	
