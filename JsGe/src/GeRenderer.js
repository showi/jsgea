



var GeRenderer = Class.create(GeObject, {
	
	initialize: function($super, parent, screen, camera, width, height) 
	{
		$super(parent);
		this.setClassName('GeRenderer');
		this.set_camera(camera);
		this.set_screen(screen);
		this.set_width(width);
		this.set_height(height);

		this.fps = 0;
		this.lastFrameTime = Date.now();
		this.frameCount = 0;
		this.layers = new Array();
		this.addLayer(GE_LAYER_COMPOSITE);
		this.addLayer(GE_LAYER_GROUND);
		this.addLayer(GE_LAYER_MOVING);
	},
	
	addLayer: function(index) 
	{
		if (this.layers[index]) {
			throw("[GeRender] Cannot add layer with same name");
		}
		ShoGE.w("Add Layer " + index, this);
		var buffer = new GeImageBuffer(this, this.width, this.height);
		this.layers[index] = buffer;
	},
	
	translate: function(x, y) 
	{
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].ctx.translate(x,y);
			}
	},
	
	save: function() 
	{
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].ctx.save();
		}
	},
	
	restore: function() 
	{
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].ctx.restore();
		}
	},		
	
	clear: function(color) 
	{
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].clear(color);
		}
	},		
	
	compose: function() 
	{
		var l = this.layers.length;
		var i;
		for (i = 1; i < l; i++) {
			this.layers[i].draw(this.layers[0].getContext(), 0, 0);
		}
	},
	
	swap: function() 
	{
		this.compose();
		this.layers[0].draw(this.Screen.getContext(), 0, 0, this.width, this.height);
		this.Screen.swap();
	},
	
	draw: function() 
	{
		color = 'rgba(0,0,0,1)';
		this.save();
		this.clear(color);
		this.Screen.draw(this);
		if (this.Camera) {
			this.Camera.draw(this);
		}	
		this.parent.SG.draw(this);
		this.swap();
		this.restore();
		var ctime = Date.now();
		var d = ctime - this.lastFrameTime;			
		if (d >= 1000.0) {
			this.fps = (this.frameCount + this.fps) / 2.0;
			this.lastFrameTime = ctime + (d - 1000);
			this.frameCount = 0;
		}
		this.frameCount++;	
	},
	
	getContext: function(index) 
	{
		if (!this.layers[index]) {
			throw("Invalid layer index for getContext " + index);
		}
		return this.layers[index].getContext();
	},
	
	/* Mouse G/S */
	set_mouse: function(mouse) 
	{
		this.Mouse = mouse;
	},
	
	get_mouse: function() 
	{
		return this.Mouse;
	},
	
	/* Camera G/S */
	set_camera: function(camera) 
	{
		this.Camera = camera;
	},
	
	get_camera: function() 
	{
		return this.Camera;
	},
	
	/* Screen G/S */
	set_screen: function(screen) 
	{
		this.Screen = screen;
	},
	
	get_screen: function() 
	{
		return this.Screen;
	},
	
	/* Width G/S */
	set_width: function(width) 
	{
		this.width = width;
	},
	
	get_width: function() 
	{
		return this.width;
	},	
	
	/* Height G/S */
	set_height: function(height) 
	{
		this.height = height;
	},
	
	get_width: function() 
	{
		return this.width;
	},	
		
	/* FPS G */
	get_fps: function() 
	{
		return this.fps;
	},
});
