let mx = 1;
let my = 1;
let easing = 0.05;

var socket = io.connect(":30000?sketch=873527");

var curr_offset = 0;
var pos_off = true;
var base_h = 0;
var base_s = 200;
var base_b = 170;
var curr_r = 30;
var t = 0;
var h_rate = 3600;
var h_rate_min = 700;
var h_rate_max = 7000;
var counter = 0;
var star_points = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
  background(0);
  //lets tell socket what to do when "IamDrawing" message is received
  //socket.on("IamDrawing", drawEllipse);
	socket.on("IamDrawing", drawStar);
	noCursor();
	ellipseMode(RADIUS);
	rectMode(CORNERS);
}

function draw() {
	background(0, 30);
	text("U/D arrows to change the number of points in your star\nhold h to change hue\nhold L/R arrows to change pulse rate\n(need to click into window first)", 100, 100);
	text("pulsing at " + (((h_rate-h_rate_min)/(h_rate_max-h_rate_min)*-100)+100) + "%", 100, 200);
	if (pos_off)
		curr_offset++;
	else
		curr_offset--;
	if (curr_offset >= 50) {
		pos_off = false;
	} else if (curr_offset <= 0) {
		pos_off = true;
	}
	// color
	curr_c = color(base_h, base_s, base_b + curr_offset);
	noStroke();
	fill(curr_c);
	curr_r = 20*sin(160*Math.PI*(t/h_rate))+100;
	// constrain to screen
	if (abs(mouseX - mx) > 0.1) {
    mx = mx + (mouseX - mx);
  }
  if (abs(mouseY - my) > 0.1) {
    my = my + (mouseY - my);
  }
  mx = constrain(mx, curr_r/1.5, width-curr_r/1.5);
  my = constrain(my, curr_r/1.5, height-curr_r/1.5);
	
  fill(237, 34, 93);
  //drawEllipse(mouseX, mouseY, curr_r, curr_c);
	drawStar(mx, my, curr_r/2, curr_r*1.5/2, star_points, curr_c);
  //lets tell socket to send a message every time we draw an ellipse
  //with the coordinates of our mouse
  socket.emit("IamDrawing", mx, my, curr_r/2, curr_r*1.5/2, star_points, base_h, base_s, base_b + curr_offset);
	checkHeldKeys();
	
	t++;
	if ((160*t/h_rate) % 2 == 0) // maybe make smoother
		t = 0;
	
	counter++;
}

//this function will be run every time a message is received
function drawEllipse(rec_x, rec_y, rec_r, rec_h, rec_s, rec_b){
	rec_c = color(rec_h, rec_s, rec_b);
	fill(rec_c);
	//print("received " + rec_x + " " + rec_y);
  ellipse(rec_x, rec_y, rec_r, rec_r);
	fill(curr_c);
}

function drawStar(x, y, radius1, radius2, npoints, rec_h, rec_s, rec_b) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
	rec_c = color(rec_h, rec_s, rec_b);
	fill(rec_c);
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
	fill(curr_c);
}


function checkHeldKeys() {
  if (keyIsDown(72)) {
    base_h++;
		if (base_h >= 255) {
			base_h = 0;
		}
  } 
	if (keyIsDown(DOWN_ARROW)) {
		if(star_points >= 3) {
			star_points--;
		}
	}
	if (keyIsDown(UP_ARROW)) {
		if (star_points <= 200){
			star_points++;
		}
	}
	if (keyIsDown(LEFT_ARROW)) {
		h_rate+=40;
	  if (h_rate >= h_rate_max) {
			h_rate = 7000;
		}
	}
	if (keyIsDown(RIGHT_ARROW)) {
		h_rate-=40;
	  if (h_rate <= h_rate_min) {
			h_rate = h_rate_min;
		}
	}
}
