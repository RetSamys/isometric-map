function startGame() {
	topLayer.start();
	backgroundLayer.start();
}

var backgroundLayer = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.id="background";
		this.canvas.style="z-index:5;position:absolute;top:0;left:0;width:100%;height:100%;";
		this.canvas.width  = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	}
};
var topLayer={
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.id="top";
		this.canvas.style="z-index:10;position:absolute;top:0;left:0;width:100%;height:100%";
		this.canvas.width  = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
	}
};