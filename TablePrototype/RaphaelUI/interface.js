/*
 * Interface library for multi-touch device management table
 * Author: Brent Nichols
 */

var raph;

// Function to create a device interface
function TouchInterface() {
	this.init = init;
    //var raph;
    var touchIndicator = [];
    
	function init(r) {
	      raph = r;
	}
	
	this.touch = function touch(fid,newX,newY) {
        c = raph.getElementByPoint(newX*window.innerWidth,newY*window.innerHeight);
        if (c) {
           expandMenu(c);
        }
	  if (touchIndicator.length == fid) {
		 // new touch point, create circle
		 touchIndicator.push(raph.circle(newX*window.innerWidth,newY*window.innerHeight,5).attr({
			    fill: "white",
			    stroke: "red"
			}));			 
	  } else {
		 touchIndicator[fid].attr({cx:newX*window.innerWidth,cy:newY*window.innerHeight});
		 touchIndicator[fid].show();
	  }
    }

	this.drag = function drag(fid,newX,newY) {
		touchIndicator[fid].attr({cx:newX*window.innerWidth,cy:newY*window.innerHeight});
	}

	this.release = function release(fid,newX,newY) {
		 touchIndicator[fid].hide();
         var c = raph.getElementByPoint(newX*window.innerWidth,newY*window.innerHeight);
         if (c) {
            hideMenu(c);
         }
      }
}

this.hideMenu = function hideMenu(menu) {
	var x = menu.attrs.x,
	y = menu.attrs.y;
	menu.menuSector1.animate({scale: [1, 1, x+25, y+25]}, 500, "elastic");
	menu.menuSector2.animate({scale: [1, 1, x+25, y+25]}, 500, "elastic");
	menu.menuSector3.animate({scale: [1, 1, x+25, y+25]}, 500, "elastic");
}


this.expandMenu = function expandMenu(menu) {
	var x = menu.attrs.x,
	y = menu.attrs.y;
	menu.menuSector1.animate({scale: [1.6, 1.6, x+25, y+25]}, 500, "elastic");
	menu.menuSector2.animate({scale: [1.6, 1.6, x+25, y+25]}, 500, "elastic");
	menu.menuSector3.animate({scale: [1.6, 1.6, x+25, y+25]}, 500, "elastic");
}


this.sector = function sector(cx, cy, r, startAngle, endAngle, params) {
    var rad = Math.PI / 180,
        x1 = cx + r * Math.cos(-startAngle * rad),
        x2 = cx + r * Math.cos(-endAngle * rad),
        y1 = cy + r * Math.sin(-startAngle * rad),
        y2 = cy + r * Math.sin(-endAngle * rad);
    return raph.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
}


function DeviceInterface() {
    var group;
    //var raph;
	
    this.move = function move(newX,newY,angle) {
    	var degrees = ((angle * 180) / Math.PI);
    	group.animate({rotation:degrees,x:newX*window.innerWidth-225,y:newY*window.innerHeight-225},5);
    }     
    
    this.hide = function hide() {
    	group.hide();
    }

    this.show = function show(newX, newY) {
    	group.show();
    	group.attr({x:newX*window.innerWidth-225,y:newY*window.innerHeight-225});
    }
    
    function menuButton(raph,group,button_icon,i) { 
    	var x = 100*Math.sin((Math.PI/5)*2*i)+200,
			y = 0-100*Math.cos((Math.PI/5)*2*i)+200,	
			color = "hsb(0.7, 1, .2)",
			bcolor = "hsb(0.7, 1, 1)",
			menuSector1 = sector(x+25,y+25,25,0,120,{gradient: "90-" + bcolor + "-" + color, stroke: "#fff", "stroke-width": 2}),
			menuSector2 = sector(x+25,y+25,25,120,240,{gradient: "90-" + bcolor + "-" + color, stroke: "#fff", "stroke-width": 2}),
			menuSector3 = sector(x+25,y+25,25,240,360,{gradient: "90-" + bcolor + "-" + color, stroke: "#fff", "stroke-width": 2}),
			imgMenu = raph.image(button_icon,x,y,50,50);
    		group.push(menuSector1);
    		group.push(menuSector2);
    		group.push(menuSector3);
    		imgMenu.menuSector1 = menuSector1;
    	    imgMenu.menuSector2 = menuSector2;
    	    imgMenu.menuSector3 = menuSector3;
    	group.push(imgMenu);
    }

	this.init = function init(r) {
	  raph = r;
	  group = r.group();	  
	  var image_locations = ["imgs/operator.png", "imgs/tools.png", "imgs/check.png", "imgs/clock.png", "imgs/home.png"];
	  for (var i=0;i<5;i++) {
		  menuButton(r,group,image_locations[i],i);
	  }	  
	  group.attr({x:0,y:0});
	  group.hide();
	};    
}