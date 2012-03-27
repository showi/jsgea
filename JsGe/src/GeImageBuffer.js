/* 
 * CLASS Image Buffer
 * 
 * We are storing our image into html canvas object, ready to be used
 */
var GeImageBuffer = Class.create(GeObject, {
	
	initialize: function($super, parent, w, h) 
	{
		$super(parent);
		this.setClassName('GeImageBuffer');
		this.width = w;
		this.height = h;
		this.initBuffer();
		this.htmlCanvas = null;
		this.ctx = null;
		this.bgcolor = 'rgba(244,0,0,0)';
		this.initBuffer();
	},
	
	initBuffer: function() 
	{
		this.htmlCanvas = document.createElement('canvas');
		this.htmlCanvas.width = this.width;
		this.htmlCanvas.height = this.height;
		this.ctx = this.htmlCanvas.getContext('2d');
		this.clear(this.bgcolor);
		return this.htmlCanvas;
	},
	
	getContext: function() 
	{
		return this.htmlCanvas.getContext('2d');
	},
	
	clear: function(color) 
	{
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.width, this.height);
	},
	
	draw: function(ctx) 
	{
		ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height);
	},
	
	getCanvas: function()
	{
		return this.htmlCanvas;
	},
	
});