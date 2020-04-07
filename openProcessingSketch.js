var socket = io.connect(":30000?sketch=422944");

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  //lets tell socket what to do when "IamDrawing" message is received
  socket.on("IamDrawing", drawEllipse);
}

function draw() {
  ellipse(mouseX, mouseY, 20, 20);
  //lets tell socket to send a message every time we draw an ellipse
  //with the coordinates of our mouse
  socket.emit("IamDrawing", mouseX, mouseY);
}

//this function will be run every time a message is received
function drawEllipse(x,y){
  ellipse(x, y, 20, 20);
}

//source: https://www.openprocessing.org/sketch/422944