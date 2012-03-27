var GeTest_LinkedList = new Class.create(GeTest, {
	initialize: function($super) {
		$super("Linked List");
	},
	
	run: function() {
		this.log.w("[" + this.name + "] Starting test");
		var ll = new GeLinkedList();
		var toRemove = new Array();
		for (var i = 0; i < 20; i++) {
			var elm = ll.add("MaVar[" + i + "]");
			var rand = Math.random();
			this.log.w("Random: "  + rand);
			if (rand > 0.5) {
				this.log.w("removed");
				toRemove.push(elm);
			}
		}
		var it = ll.iterator();
		var elm = null;
		it.reset_head();
		this.log.w("----- ----- -----");
		while((elm = it.next())) {
			this.log.w("elm: " + elm.data);
		}
		this.log.w("----- ----- -----");
		it.reset_tail();
		while((elm = it.prev())) {
			this.log.w("elm: " + elm.data);
		}
		this.log.w("----- ----- -----");
		for(var i = 0; i < toRemove.length; i++) {
			var elm;
			if (elm = ll.remove(toRemove[i])) {
				this.log.w("Element removed: " + elm.data);
			} else {
				this.log.w("Cannot remove element");
			}
		}
		this.log.w("----- ----- -----");
		it.reset_head();
		while((elm = it.next())) {
			this.log.w("elm: " + elm.data);
		}
	},
});
 function GeTest_LinkedList_start() {
		var T = new GeTest_LinkedList();
}


