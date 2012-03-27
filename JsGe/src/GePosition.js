var GePosition = Class.create(Vector2D, {
	initialize: function($super, x, y, orientation) {
		$super(x, y);
		if (orientation) {
			this.orientation = orientation;
		} else {
			this.orientation = new Vector2D(0, 1);
		}
	},
});