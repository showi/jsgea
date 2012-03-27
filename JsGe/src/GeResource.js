var GeResource = Class.create(GeLoadable, {
	initialize: function($super, parent) {
		$super(parent);
		this.data = null;
	},
	
	load: function(res) {
		ShoGE.w("[AjaX] Loading resource: " + res);
		var that = this;
		new Ajax.Request(res,
		{
			method:'get',
			onSuccess: function(transport){
				//alert(json ? Object.inspect(json) : "no JSON object");
				var data = transport.responseText; // || "no response text";
				that.data = data.evalJSON(true);
				that.setLoaded(true);
			},
			onFailure: function(){ ShoGE.w("Cannot load level info"); }
		});
	},
});
