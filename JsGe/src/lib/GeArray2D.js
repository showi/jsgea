var GeArray2D = Class.create({
	
	initialize: function(width, height) 
	{
		if (!width) { throw("GeArray2D: Cannot calcul array index without array width");}
		this.width = width;
		this.height = height;
		this.data = new Array(null);
	},
	
	get: function(x,y) 
	{
		return this.data[y*this.width + x];
	},
	
	set: function(x,y, data) 
	{
		this.data[y*this.width + x] = data;
	},
	
	getWidth: function() 
	{
		return this.width;
	},
	
	iterate: function(callback) 
	{
		var i;
		var max = this.width * this.height;
		for (i = 0; i < max; i++) {
			var row = i % this.width;
			var col = i - row;
		}
	},
	
});
