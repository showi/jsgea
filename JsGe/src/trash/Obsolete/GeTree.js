/*# > Object < #*/
var GeBound = Class.create(GeObject, {
    /*# > Method < #*/
    initialize: function($super, parent) {
        $super();
        this.parent = parent;
    },
    add: function(bound) {
        this[bound.type] = bound;
    },
    get: function(type) {
        return this[type];
    }
});
