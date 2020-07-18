var foregroundImg;
var bgImg;
var sq;
var colpaths=[];
var overlpaths=[];
var overlimgs=[];
var posX=(window.innerWidth-30)/2+15;
var posY=(window.innerHeight-30)/2+15;
var moving=false;
var nostop=true;
var speed=2;

function startGame() {
	sq=new component(30, 30, "red", ((window.innerWidth-30)/2), ((window.innerHeight-30)/2),backgroundLayer);
	bgImg=new component(1242, 594, "1.png", posX, posY,backgroundLayer,"image");
	foregroundImg=new component(1242, 594, "2.png", posX, posY,backgroundLayer,"image");
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
		this.interval = setInterval(updateGameArea, 30);
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
			var p=new Path2D();
			p.moveTo(colpoints[i][0][0],colpoints[i][0][1]);
			for (j=1;j<colpoints[i].length;j++){
				p.lineTo(colpoints[i][j][0],colpoints[i][j][1]);
			}
			p.closePath();
			colpaths.push(p);
		}
		
		//set up overlay areas
		for(i=0;i<overlays.length;i++){
			var pic=new component(overlays[i][0][0],overlays[i][0][1],overlays[i][0][2],posX, posY,topLayer,"image");
			overlimgs.push(pic);
			var o=new Path2D();
			o.moveTo(overlays[i][1][0],overlays[i][1][1]);
			for (j=2;j<overlays[i].length;j++){
				o.lineTo(overlays[i][j][0],overlays[i][j][1]);
			}
			o.closePath();
			overlpaths.push(o);
		}
		
		//controls (mouse, keyboard, touchscreen)
		window.addEventListener('mousedown',function (e){
			if((e.pageX/topLayer.canvas.width)>.5){
				topLayer.x=1;
				if ((e.pageY/topLayer.canvas.height)>.5){
					topLayer.y=.58;
				}else{
					topLayer.y=-.58;				
					}
			}else{
				topLayer.x=-1;
				if ((e.pageY/topLayer.canvas.height)>.5){
					topLayer.y=.58;
				}else{
					topLayer.y=-.58;
				}
			}
		});
		window.addEventListener('mouseup', function (e) {
            topLayer.x=false;
			topLayer.y=false;
        });
		
		
		window.addEventListener('touchstart',function (e){
			if((e.touches[0].clientX/topLayer.canvas.width)>.5){
				topLayer.x=1;
				if ((e.touches[0].clientY/topLayer.canvas.height)>.5){
					topLayer.y=.58;
					console.log("lower right "+e.touches[0].clientX+" "+e.touches[0].clientY);
				}else{
					topLayer.y=-.58;				
					console.log("upper right "+e.touches[0].clientX+" "+e.touches[0].clientY);
					}
			}else{
				topLayer.x=-1;
				if ((e.touches[0].clientY/topLayer.canvas.height)>.5){
					topLayer.y=.58;
					console.log("lower left "+e.touches[0].clientX+" "+e.touches[0].clientY);
				}else{
					topLayer.y=-.58;
					console.log("upper left "+e.touches[0].clientX+" "+e.touches[0].clientY);
				}
			}
		});
		window.addEventListener('touchend', function (e) {
            topLayer.x=false;
			topLayer.y=false;
        });
		
		window.addEventListener('keydown', function (e) {
			if(e.keyCode==40||e.keyCode==83){
				topLayer.x=1;
				topLayer.y=.58;
			}else if(e.keyCode==39||e.keyCode==68){
				topLayer.x=1;
				topLayer.y=-.58;
			}else if(e.keyCode==37||e.keyCode==65){
				topLayer.x=-1;
				topLayer.y=.58;
			}else if(e.keyCode==38||e.keyCode==87){
				topLayer.x=-1;
				topLayer.y=-.58;
			}
		});
		window.addEventListener('keyup', function (e) {
			if (e.keyCode==37||e.keyCode==38||e.keyCode==39||e.keyCode==40||e.keyCode==83||e.keyCode==68||e.keyCode==65||e.keyCode==87){
				topLayer.x=false;
				topLayer.y=false;
			}
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
    backgroundLayer.clear();  
	topLayer.clear();
	if (topLayer.x){
		nostop=true;
		//collision detection
		for (i=0;i<colpaths.length;i++){
			if (topLayer.context.isPointInPath(colpaths[i],Math.round(sq.x-bgImg.x+topLayer.x*speed),Math.round(sq.y-bgImg.y+topLayer.y*speed))){
				nostop=false;
				console.log("collision");
				break;
			}
		}
		
		
		if (nostop){
		bgImg.x-=topLayer.x*speed;
		bgImg.y-=topLayer.y*speed;
		foregroundImg.x-=topLayer.x*speed;
		foregroundImg.y-=topLayer.y*speed;
		
		for (i=0;i<overlimgs.length;i++){
			overlimgs[i].x-=topLayer.x*speed;
			overlimgs[i].y-=topLayer.y*speed;
		}
		
		}
		
	}
	bgImg.update();
	foregroundImg.update();
	topLayer.context.stroke();
	sq.update();
	//overlay detection
		for (i=0;i<overlpaths.length;i++){
			if (topLayer.context.isPointInPath(overlpaths[i],Math.round(sq.x-bgImg.x),Math.round(sq.y-bgImg.y))){
				overlimgs[i].update();
			}
		}
}