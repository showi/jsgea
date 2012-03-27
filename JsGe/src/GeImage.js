var GeImage = Class.create(GeLoadable, {

	initialize: function($super, parent, src, callback) {
		$super(parent);
		this.setClassName('GeImage');
		this.setLoaded(false);
		if (typeof(callback) == 'function') {
			this.set_callback(callback);
		}
		if (src) {
			try {
				this.set(src);
			} catch(e) {
				ShoGE.w("Error: Fail to add image '"+src+"'", this);
			}
		}
		return this;
	},

	set: function(src) {
		this.src = src;
		this.img = new Image();
		this.img.src = src;
		this.setLoaded(false);
		this.error = false;
		var that = this;//this.onload.bind(this);
		this.img.onload = function() {
			ShoGE.w("Image loaded >> " + that.src, that);
			that.setLoaded(true);		
			that._setCanvas();
			that.exec_callback();
			
		};
		this.img.onerror = function() {
			that.error = true;
			throw("Loading image " + that.src  + " failed.");
		};
	},
	_setCanvas: function() {
			this._canvas = document.createElement('canvas');
			this._canvas.width = this.img.width;
			this._canvas.height = this.img.height;
			var ctx = this._canvas.getContext('2d');
			ctx.drawImage(this.img, 0,0);
			return this._canvas;
	},
	get: function() {
		return this.img;
	},
	
	set_callback: function(callback) {
		//ShoGE.w("Setting up callback");
		this.callback = callback;
	},
	
	exec_callback: function() {
		//ShoGE.w("Exec callback "  + this.callback);
		if (!this.callback && typeof(this.callback) != 'function') {
			ShoGE.w("No callback to call");
			return 0;
		}
		this.callback(this);
		return 1;
	},
	
	as_canvas: function() { return this.asCanvas(); },
	
	asCanvas: function() {
		return this._canvas;
	},
	
});
