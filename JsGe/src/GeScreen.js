var GeScreen = Class.create(GeEntity, {
	
	initialize: function($super, parent, id, width, height) {
		$super(parent);
		this.id = id;
		//this.parent = parent;
		this.width = width;
		this.height = height;
		this.bgcolor = "rgb(f,0,0)";
		this.htmlCanvas = document.getElementById(id);
		if (!this.htmlCanvas.getContext || !this.htmlCanvas.getContext('2d')){
			alert("HTML 5 canvas may be not supported on your system");
			exit(1);
		}
		//this.htmlContext = this.canvas.getContext('2d'); 
		
		this.buffer = new GeImageBuffer(this, width, height);
	},
	
	
	set_bgcolor: function(bgcolor) {
		this.bgcolor = bgcolor;
	},
	
	get_bgcolor: function(bgcolor) {
		return this.bgcolor;
	},
	
	swap: function() {
		//ShoGE.w("Swap screen");
		this.buffer.draw(this.htmlCanvas.getContext('2d'), 0, 0);
		this.buffer.clear('rgba(0,0,0,1)');
	},
	
	clear: function(color) {
		//ShoGE.w("Clear screen " + color);
		this.buffer.clear(color);
	},
	
	getContext: function() {
		return this.buffer.getContext();
	},
	
	getCanvas: function() {
		return this.buffer.getCanvas();
	},
	
	draw: function($super, renderer) {
		//ShoGE.w("Screen x: " + this.width/2 + " y: " + this.height/2);
		renderer.translate(this.width/2, this.height/2);
	}
});
