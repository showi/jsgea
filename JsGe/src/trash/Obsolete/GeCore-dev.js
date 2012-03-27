var GeCore = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		$super(parent);
		
		this.lastDraw = this.currentTime;
		this.pause = false;
	},
	
	init: function(width, height) 
	{
		/* Init Global Variables */
		this.init_global_variables();
		
		/* Discrete Time */
		this.DiscreteTime = new GeDiscreteTime(15);
		
		/* Create Screen object */
		this.Screens = new Hash();
		this.add_screen("GameScreen", width, height);
		this.add_screen("GameScreen3", width / 2, height / 2);
		
		/* Create our mouse */
		this.Mouse = new GeMouse(this, 'GameScreen');
		
		/* Create our keyboard */
		this.Keyboard = new GeKeyboard(this, 'GameScreen');
		
		/* Create our image pool */
		this.Images = new GeMediaPool();
		
		/* Create our scene graph */
		this.SG = new GeTreeNode_Collection(null, "World");
	
		/* Create our renderers */
		this.Renderers = new Hash();
		this.add_renderer('GameScreen', this.Screens.get('GameScreen'), null, width, height);
		this.Renderers.get("GameScreen").set_mouse(this.Mouse);
		
		this.Level = new GeLevel(this, 'darks');
		this.Level.load(0);
		
		this.Grid = new GeTreeNode_Grid(this, 2,2, 512);
		this.SG.add_child(this.Grid);
		
		this.load_ressources();
		
		this.ImageReady = new GeWaitLoading(parent, this.Screens.get('GameScreen'), this.Images);

		this.SG.preload_ressources();
		
		this.start();
	},
	
	init_global_variables: function() 
	{
		ShoGE.Log = new GeLog("GameLog");
		ShoGE.w = function(msg) { ShoGE.Log.w(msg) };
		
	},

	load_ressources: function() 
	{
		var m = null;
		this.numMonster = 0;
		for(var i = 0; i < 1; i++) {
			m = new GeTreeNode_Monster(null);
			this.Grid.add(m);
			this.numMonster++;
		}
		this.camera = new GeCamera(parent, m);
		this.SG.add_child(this.camera);
		/*this.add_renderer(
			'GameScreen3',
			this.Screens.get("GameScreen3"), 
			this.camera, 
			this.width/2, 
			this.height/2
		);*/
		var map = new GeTreeNode_Map(null);
		
		/* Testing sprite */
		var sprite_set = new GeSpriteSet("sprites/charsets12", 16, 16);
		sprite_set.preload_ressources(this.Images);
		var s = sprite_set.set_sprite("warrior", 16, 180);
		s.set_animation("walk_up"    , 0, 3);
		s.set_animation("walk_right" , 1, 3);
		s.set_animation("walk_down", 2, 3)
		s.set_animation("walk_left"   , 3, 3)
		
	},

	start: function()
	{
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		ShoGE.w("--- Starting Game Engine");
		// Render HTML Elemet (Updating html element is an heavy process)
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.5);
		
		new PeriodicalExecuter(function(pe) {			
			if (that.ImageReady.is_loading()) {
				that.ImageReady.draw();
			} else {
				pe.stop();
				that.start_loop();
			}
		}, 0.1);
		
	},
	
	togglePause: function() 
	{
		if (this.pause) {
			this.pause = false;
			this.currentTime = Date.now();
			this.start_loop();
		} else {
			this.pause = true;
			this.MainLoop.stop();
		}
	},
	
	/* HTML update: Running in separate thread.*/
	html_update: function()
	{
		$('GameFPS').innerHTML = Math.round(this.Renderers.get('GameScreen').get_fps());
		$('GameElapsedTime').innerHTML = Math.round(this.DiscreteTime.t/10)/100 + "&nbsp;s";
		$('GameAlpha').innerHTML = this.DiscreteTime.alpha;
		$('clickatX').innerHTML = this.Mouse.pos.x;
		$('clickatY').innerHTML = this.Mouse.pos.y;
		$('MouseStatus').innerHTML = this.Mouse.status;
		//$('GameMsg').innerHTML = this.Msg;
		if (this.Mouse.status) {
			if (this.Mouse.status == 'down') {
				$('clickDownX').innerHTML = this.Mouse.down.x;
				$('clickDownY').innerHTML = this.Mouse.down.y;
			}
		} else {
			$('clickDownX').innerHTML = 0;
			$('clickDownY').innerHTML = 0;
			$('GameNumMonster').innerHTML = this.numMonster;
		}
	},
	
	start_loop: function() 
	{
		var that = this;
		this.MainLoop = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, 1/1000);
		this.RenderingLoop = new PeriodicalExecuter(function(pe) {	
			that.Renderers.each(function(pair) {
				pair.value.draw();
			});
			that.DiscreteTime.alpha = 0;
			that.SG.post_rendering();
	
		}, 1/60);
	},
	
	loop: function() 
	{	
		this.Msg = "Keyscan<br>-----&nbsp;---&nbsp;-----<br>";
		var that = this;
		this.Keyboard.scan(function(key) {
			if (key.is(GeKeys.ENTER) && key.is_complete()) {
				//ShoGE.w(key.get_string());
				key.reset();
				var m = new GeTreeNode_Monster(null);
				that.Grid.add(m);
				that.numMonster++;
			}
		});
		this.Mouse.clicks.each(function(c) {
				var m = new GeTreeNode_Monster(null);
				m.phys.pos = c;
				that.Grid.add(m);	
				that.numMonster++;
		});
		this.Mouse.reset_click();
		//$('GameMsg').innerHTML = this.Msg;
		//this.Keyboard.reset();
		/* Update our scene graph with discrete time */
		this.DiscreteTime.consume(this.SG);
	},
	
	/* Helpers */
	add_screen: function (id, width, height, bgcolor) 
	{
		this.Screens.set(id, 
			new GeScreen(this, id, width, height)
		);
		if (bgcolor) this.Screens.get(id).set_bgcolor(bgcolor);
	},
	
	add_renderer: function(id, screen, camera, width, height) {
			this.Renderers.set(id,
				new GeRenderer(this, screen, camera, width, height)
			);
		},
});	
