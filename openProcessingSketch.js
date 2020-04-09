var socket = io.connect(":30000?sketch=869957");
var x, y;
var size = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  //lets tell socket what to do when "IamDrawing" message is received
  socket.on("IamDrawing", drawEllipse);
	socket.on("AddingCircle", makeCircle);
	ellipse(mouseX, mouseY, 20, 20);
	x = 100;
	y = 100;
}

function draw() {
	background(231);
	ellipse(mouseX, mouseY, 20, 20);
  //lets tell socket to send a message every time we draw an ellipse
  //with the coordinates of our mouse
  socket.emit("IamDrawing", mouseX, mouseY);

	makeCircle();
	socket.emit("AddingCircle");
	
	if (isInEllipse(mouseX, mouseY)) print("hey");

	// for each circle:circles{
	// 	check if enough mice on circle, then delete circle if so
	// }
}

function isInEllipse(mouseX,mouseY){
    var dx=mouseX-x;
    var dy=mouseY-y;
    return ((dx*dx)/(size*size)+(dy*dy)/(size*size)<=1);
}

//this function will be run every time a message is received
function drawEllipse(x,y){
  ellipse(x, y, 20, 20);
}

function makeCircle(){
	ellipse(x, y, 100, 100);
}

//source: https://www.openprocessing.org/sketch/422944