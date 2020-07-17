var foregroundImg;
var bgImg;
var sq;
var colpaths=[];

function startGame() {
	sq=new component(30, 30, "red", ((window.innerWidth-30)/2), ((window.innerHeight-30)/2),backgroundLayer);
	bgImg=new component(1242, 594, "1.png", 0, 0,backgroundLayer,"image");
	foregroundImg=new component(1242, 594, "2.png", 0, 0,topLayer,"image");
	topLayer.start();
	backgroundLayer.start();
	updateGameArea();
}

var backgroundLayer = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.id="background";
		this.canvas.style="z-index:5;position:absolute;top:0;left:0;";
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};
var topLayer={
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.id="top";
		this.canvas.style="z-index:10;position:absolute;top:0;left:0;";
		this.canvas.width  = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		
		//set up collision areas
		for(i=0;i<colpoints.length;i++){
			this.context.beginPath();
			var p=new Path2D();
			this.context.moveTo(colpoints[i][0][0],colpoints[i][0][1]);
			p.moveTo(colpoints[i][0][0],colpoints[i][0][1]);
			for (j=1;j<colpoints[i].length;j++){
				p.lineTo(colpoints[i][j][0],colpoints[i][j][1]);
				this.context.lineTo(colpoints[i][j][0],colpoints[i][j][1]);
			}
			p.closePath();
			this.context.closePath();
			this.context.stroke();
			colpaths.push(p);
		}
		
		window.addEventListener('mousedown',function (e){
			if((e.pageX/topLayer.canvas.width)>.5){
				topLayer.x=1;
				if ((e.pageY/topLayer.canvas.height)>.5){
					topLayer.y=1;
				}else{
					topLayer.y=-1;
				}
			}else{
				topLayer.x=-1;
				if ((e.pageY/topLayer.canvas.height)>.5){
					topLayer.y=1;
				}else{
					topLayer.y=-1;
				}
			}
		});
		window.addEventListener('mouseup', function (e) {
            topLayer.x = false;
            topLayer.y = false;
        });
	},
	    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};


function component(width, height, color, x, y, layerName,type) {
    if (type == "image" || type == "background") {
		this.type = type;
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = layerName.context;
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }    
}

function updateGameArea() {
	if (topLayer.x){
		var nostop=true;
		for (i=0;i<colpaths.length;i++){
			if (topLayer.context.isPointInPath(colpaths[i],bgImg.x-topLayer.x,bgImg.y-topLayer.y)){
				nostop=false;
				break;
			}
		}
		if (nostop){
		bgImg.x-=topLayer.x;
		bgImg.y-=topLayer.y*.58;
		foregroundImg.x-=topLayer.x;
		foregroundImg.y-=topLayer.y*.58;
		}
	}
    backgroundLayer.clear();  
	bgImg.update();
	topLayer.clear();
	foregroundImg.update();
	sq.update();
	topLayer.context.stroke();
}