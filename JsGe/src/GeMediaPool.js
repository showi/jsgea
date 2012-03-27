var GeMediaPool = Class.create(GeObject, {
	
	initialize: function($super, id) 
	{
		$super(parent);
		this.setClassName('GeMediaPool');
		this.pool = new Hash();
		this.path = "res/";
		//var that = this;
		this.total = 0;
		this.total_loaded = 0;
	},
	
	add: function(p_src, callback) 
	{
		var src = this.path + p_src;
		var that = this;
		if (!this.pool.get(src)) {
			ShoGE.w("Adding image " + src, this);
			this._inc_total();
			this.pool.set(src, new GeImage(this, src, function() {
				that._inc_loaded();
				if (callback) {
					callback(that.pool.get(src));
				}
			}));
		}
		if (this.pool.get(src).isLoaded()) {
			if (callback) {
				callback(that.pool.get(src));
			}
		}
		return this.pool.get(src);
	},
	
	get: function(p_src) 
	{
		var src = this.path + p_src;
		var img = this.pool.get(src);
		if (!img) { throw("GeImagePool: Trying to get invalid image: " + src); }
		if (!img.isLoaded()) {
			throw("Unloaded image");
			
		}
		return img;
	},
	
	is_loading: function() 
	{
		var diff = this.total - this.total_loaded;
		//ShoGE.w("Loading diff: " + diff);
		return diff;
	},
	
	_inc_total: function() 
	{
		//ShoGE.w("Increment total image " + this.total);
		this.total++;
	},
	
	_inc_loaded: function() 
	{
		//ShoGE.w("Increment total loaded image " + this.total_loaded);
		this.total_loaded++;
	}
	
});
