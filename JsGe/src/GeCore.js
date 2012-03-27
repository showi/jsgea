var GeCore = Class.create(GeObject, {
	
	initialize: function($super, parent) {
		$super(parent);
	
	},
	
	init: function(width, height) 
	{

		/* Init Global Variables */
		this.init_global_variables();
		
		/* Discrete Time */
		this.DiscreteTime = new GeDiscreteTime(this, GE_CORE_DISCRETE_TIME);
		
		/* Create Screen object */
		this.Screens = new Hash();
		
		/* Create our image pool */
		this.Images = new GeMediaPool();
		
		/* Create our scene graph */
		//this.SG = new GeTreeNode_Collection(null, "World");
	
		/* Create our renderers */
		this.Renderers = new Hash();
		
	},
	
	init_global_variables: function() 
	{
		ShoGE.Log = new GeLog("GameLog");
		ShoGE.w = function(msg, o) { ShoGE.Log.w(msg,o); };		
	},

	load_ressources: function() {},
	
	hookPreStart: function() {},
	
	/*
	 * Starting game engine 
	 */
	start: function()
	{
		var that = this;
		this.startTime = Date.now();
		this.lastFrameTime = Date.now();
		
		ShoGE.w("--- Starting Game Engine");
		// Render HTML Elemet (Updating html element is an heavy process)
		this.timer = new PeriodicalExecuter(function(pe) {	
			that.html_update();
		}, 0.7);
		
		new PeriodicalExecuter(function(pe) {			
			if (that.ImageReady.is_loading()) {
				that.ImageReady.draw();
			} else {
				pe.stop();
				that.hookPreStart();
				that.start_loop();
			}
		}, 0.7);
		
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
	html_update: function() {},
	
	start_loop: function() 
	{
		var that = this;
		this.MainLoop = new PeriodicalExecuter(function(pe) {	
			that.loop();
		}, GE_CORE_TIMER_UPDATE);
		this.RenderingLoop = new PeriodicalExecuter(function(pe) {	
			that.Renderers.each(function(pair) {
				pair.value.draw();
			});
			that.DiscreteTime.alpha = 0;
			that.SG.post_rendering();
	
		}, GE_CORE_TIMER_RENDERING);
	},
	
	hookPreUpdate: function(that) {
		ShoGE.w("Pre update");
	},
	
	loop: function() 
	{	
		/* Update our scene graph with discrete time */
		this.DiscreteTime.consume(this, this.SG);
	},
	
	/* Helpers */
	add_screen: function (id, width, height, bgcolor) 
	{
		this.Screens.set(id, 
			new GeScreen(this, id, width, height)
		);
		if (bgcolor) this.Screens.get(id).set_bgcolor(bgcolor);
		return this.Screens.get(id);
	},
	
	add_renderer: function(id, screen, camera, width, height) {
			this.Renderers.set(id,
				new GeRenderer(this, screen, camera, width, height)
			);
			return this.Renderers.get(id);
		},
	get_renderer: function(id) {
		return this.Renderers.get(id);
	},
	
	set_mouse: function(id) {
		this.Mouse = new GeMouse(this, id);
		return this.Mouse;
	},
	
	get_mouse: function() {
		return this.Mouse;
	},
	
	set_keyboard: function(id) {
		this.Keyboard = new GeKeyboard(this, id);
		return this.Keyboard;
	},
	get_keyboard: function() {
		return this.Keyboard;
	},
	
	set_imageReady: function(screen, pool) {
		this.ImageReady = new GeWaitLoading(this, screen, pool);
	},
	
	supportsLocalStorage: function() {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	},
	
});	
