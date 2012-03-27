var GeLinkedList_Iterator = Class.create({
	initialize: function(ll) {
		this.ll = ll;
		this.current = ll.head;
	},
	next: function() {
		if (!this.current) return null;
		var elm = this.current;
		this.current = this.current.next;
		return elm;
	},
	prev: function() {
		if (!this.current) return null;
		var elm = this.current;
		this.current = this.current.prev;
		return elm;
	},
	reset_head: function() {
		this.current = this.ll.head;
	},
	reset_tail: function() {
		this.current = this.ll.tail;
	}
	
});

var GeLinkedList_Element = Class.create({
	initialize: function(data) {
		this.prev = null;
		this.next = null;
		this.data = data;
	},
});

var GeLinkedList = Class.create({
	initialize: function() {
		this.head = null;
		this.tail = null;
	},
	iterator: function() {
		return new GeLinkedList_Iterator(this);
	},
	add: function(data) {
		var elm = new GeLinkedList_Element(data);
		if (!this.head && !this.tail) {
			this.head = elm;
			this.tail = elm;
		} else {
			this.tail.next = elm;
			elm.prev = this.tail;
			this.tail = elm;
		} 
		return elm;
	},
	
	/*ins: function(target, inserted) {
		var elm = this.head;
		while(elm != target && elm.next) {
			elm = this.head.next;
		}
		if (elm != target) {
			throw("No matching target to insert element");
		}
		var next = elm.next;
		elm.next = inserted;
		inserted.prev = elm;
		inserted.next = next;
	},
	*/
	remove: function(remElm) {
		var it = new GeLinkedList_Iterator(this);
		var elm;
		while(elm = it.next()) {
			if (elm.data == remElm) {
				ShoGE.w("Removing element");
				if (elm == this.head) {
					this.head = elm.next;
				}
				if (elm == this.tail) {
					this.tail = elm.prev;
				}
				if (elm.prev) {
					elm.prev.next = elm.next;	
				}
				if (elm.next) {
					elm.next.prev = elm.prev;
				}
				elm.prev = null;
				elm.next = null;
				return elm;
			}
		}
		return null;
	},
	
	getTailItem: function() {
		if (!this.tail) {
			return null;
		}
		return this.tail.data;
	},
	
	getHeadItem: function() {
		if (!this.head) {
			return null;
		}
		return this.head.data;
	},
});
