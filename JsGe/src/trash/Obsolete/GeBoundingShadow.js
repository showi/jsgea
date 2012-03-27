var GeBound_Shadow = Class.create(GeBounding, {
	initialize: function($super, parent) {
		$super(parent);
		this.type = 'shadow';
		this.shadow = document.createElement('canvas');		
	},
	collide: function(map) {
			var ctx = this.shadow.getContext('2d');		
			this.shadow.width = this.parent.gx.width;
			this.shadow.height = this.parent.gx.height;
			var dwi = this.shadow.width / 2;
			var dhe = this.shadow.height / 2;
			var cposx =  -this.parent.phys.pos.x + dwi;
			var cposy =  -this.parent.phys.pos.y + dhe
			
			ctx.save();
			ctx.save();
			ctx.translate( cposx, cposy);
			this.parent.gx.draw(ctx);
			ctx.restore();
			ctx.globalCompositeOperation = 'source-in';
			var posX = this.parent.phys.pos.x - dwi;
			if (posX < 0) {
				posX = 0;
			} else if (posX > this.shadow.width) {
				posX = this.shadow.width;
			}			
			var posY = this.parent.phys.pos.y - dhe;
			if (posY < 0) {
				posY = 0;
			} else if (posY > this.shadow.height) {
				posY = this.shadow.height;
			}
			if (posX > 640 - this.shadow.width) {
				posX = 640 - this.shadow.width;
			}
			if (posY > 480 - this.shadow.height) {
				posY = 480 - this.shadow.height;
			}
			ctx.drawImage(Core.Images.get("lvl-test-shadow.png").get(), 
				posX, posY,
				this.shadow.width, this.shadow.height,
				0, 0, this.shadow.width, this.shadow.height);
			ctx.restore();
			

			
			// Watching for colision
			//var buffer = ctx2.getImageData(0,0, this.shadow.width, this.shadow.height);
			//var buffer = ctx2.data;
			//getImageData(1,1,1,1);
			//var l = buffer.data.length / 4;
			//for(var row = 0; row < this.shadow.height; row++) {
	    	/*var avgCol = 0;
			var avgRow = 0;
			var l = 1;
			for (var i = 0; i < l; i++) {
	    	  var r = frame.data[i * 4 + 0];
	    	  var g = frame.data[i * 4 + 1];
	    	  var b = frame.data[i * 4 + 2];
			  var a = buffer.data[i * 4 + 3];
			  var a = 0;
	    	  if (a == 1) {
				avgCol = (avgCol + col) / 2;
				avgRow = (avgRow + row) / 2;
			  }
				if (g > 100 && r > 100 && b < 43)
	    	    	frame.data[i * 4 + 3] = 0;
				}
			}
			ShoGE.w("avg: " + avgRow + ", " + avgCol);*/
			
			
			var c2 = document.createElement('canvas');
			ctx2 = c2.getContext('2d');
			c2.height = this.shadow.height;
			c2.width = this.shadow.width;
			ctx2.fillStyle = "rgba(250,250,250, 0)";
			ctx2.fillRect (0, 0, 32, 32);
			ctx2.drawImage(this.shadow, 0, 0);
			
			var cs = document.getElementById('GameScreen2').getContext('2d')
			cs.fillStyle = "rgba(250,50,250, 1)";
			cs.fillRect (0, 0, 32, 32);
			cs.drawImage(c2, 0, 0);
			
	},
});
