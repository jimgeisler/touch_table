
document.addEvent('domready', function(){
	var canvas = new Canvas(document.getElement('canvas')),
		cloth = new Cloth(canvas),
		inputs = {}, point,
		key_down, mouse_down, mouse;
	
	var position = function(event){
		return canvas.adjust({
			x: event.page.x,
			y: event.page.y
		});
	};
	
	var setPoint = function(inv_mass){
		if (!point) return;
		if (mouse) {
			point.setCurrent(mouse);
			point.setPrevious(mouse);
		}
		point.inv_mass = inv_mass;
	};
	
	document.addEvents({
		'keydown': function(event){
			key_down = true;
		},
		
		'keyup': function(){
			key_down = false;
		},
		
		'mousedown': function(event){
			mouse_down = true;
			mouse = position(event);
			
			if (!mouse) return;
			
			point = cloth.getClosestPoint(mouse);
			setPoint(0);
		},
		
		'mouseup': function(event){
			mouse_down = false;
			if (mouse) setPoint( key_down ? 0 : 1);
		},
		
		'mousemove': function(event){
			if (!mouse_down) return;
			
			mouse = position(event);
			setPoint(mouse ? 0 : 1);
		}
	});
		
	cloth.draw_points = true;//inputs.points.checked;
	cloth.draw_constraints = true;//inputs.constraints.checked;
	
	setInterval(cloth.update.bind(cloth), 35);
});

var Cloth = function(canvas){
	
	var max_points = 3,
		width = canvas.width,
		height = canvas.height,
		max_dim = Math.max(width, height),
		min_dim = Math.min(width, height),
		x_offset = width * 0.2,
		y_offset = height * 0.2,
		spacing = (max_dim - (Math.max(x_offset, y_offset) * 2)) / max_points;
	
	this.num_iterations = 2;
	this.canvas = canvas;
	this.points = [];
	this.constraints = [];
	
	var num_x_points = this.num_x_points = 3;//(max_points * (width / max_dim)).round();
	var num_y_points = this.num_y_points = 3;//(max_points * (height / max_dim)).round();
	
	var constraint;
	
	for (var i = 0, y = y_offset; i < num_y_points; i++, y += spacing){
		this.points[i] = [];
		
		for (var j = 0, x = x_offset; j < num_x_points; j++, x += spacing){
			var point;
			if (i == 0) {
				point = new Point(canvas, x / width, (y / height)+.24);
				if (j == 1) {
					point.head = true;
					point.show = true;
				} else {
					point.show = false;
				}
			} else {
				point = new Point(canvas, x / width, y / height);
				point.head = false;
				point.show = true;
			}
			this.points[i][j] = point;			
			if ((i > 0) || (j == 1)) {  			
				//add a vertical constraint
				if (i > 0){
	               if (j == 1) {
					  constraint = new Constraint(canvas, this.points[i - 1][j], this.points[i][j]);
					  this.constraints.push(constraint);
	               }
				}
				
				//add a new horizontal constraints
				if ((j > 0) && (i > 0)){
					constraint = new Constraint(canvas, this.points[i][j - 1], this.points[i][j]);
					this.constraints.push(constraint);
				}
			}
		}
	}

	this.num_constraints = this.constraints.length;
	
	for (i = 0; i < this.num_constraints; i++)
		this.constraints[i].draw();
	
};

Cloth.prototype = {
	
	update: function() {
		this.canvas.clear();
		
		var num_x = this.num_x_points,
			num_y = this.num_y_points,
			num_c = this.num_constraints,
			num_i = this.num_iterations,
			i, j;
			
		//move each point with a pull from gravity
		for (i = 0; i < num_y; i++)
			for (j = 0; j < num_x; j++)
				this.points[i][j].move();
		
		//make sure all the constraints are satisfied.
		for (j = 0; j < num_i; j++)
			for (i = 0; i < num_c; i++)
				this.constraints[i].satisfy();
		
		//draw the necessary components.
		if (this.draw_constraints)
			for (i = 0; i < this.num_constraints; i++)
				this.constraints[i].draw();
		
		if (this.draw_points)
			for (i = 0; i < this.num_y_points; i++)
				for (j = 0; j < this.num_x_points; j++)
					this.points[i][j].draw();
		
	},
	
	getClosestPoint: function(pos) {
		var min_dist = 1,
			min_point = null,
			num_x = this.num_x_points,
			num_y = this.num_y_points,
			dist, i, j;
		
		for (i = 0; i < num_y; i++){
			for (j = 0; j < num_x; j++){
				dist = pos.subtract(this.points[i][j].getCurrent()).length();
				
				if (dist < min_dist){
					min_dist = dist;
					min_point = this.points[i][j];
				}
			}
		}
		
		return min_point;
	}	
};
