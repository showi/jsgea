/*
    MAP Node
*/
/*# > Object < #*/
var GeGx_Map = Class.create({
    /*# > Method < #*/
    initialize: function(parent) {
        this.parent = parent;
    },
    /*# > Method < #*/
    draw: function(ctx) {
		//return;
        ctx.drawImage(ShoGE.Core.Images.get("map_green01.png").get(), 0, 0);
    },
});

/*# > Object < #*/
var GeTreeNode_Map = Class.create(GeTreeNode, {
    initialize: function($super, parent) {
        $super();
    },
    /*# > Method < #*/
    _init: function(parent) {
        this.type = "monster";
        this.gx = new GeGx_Map(this);
        this.unhide();
    },
});
