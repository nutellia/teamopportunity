var socket = io.connect(":30000?sketch=869957");
var x, y;
var size = 100;
var userID;
let ids = [];
var threshold = 1;
var count = 0;
var index = 0;
var locations = [
	[100, 100],
	[200, 300],
	[400, 550]
];

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255, 204, 0);
	userID = Math.trunc(Math.random() * 100);
	//lets tell socket what to do when "IamDrawing" message is received
	socket.on("IamDrawing", drawEllipse);
	socket.on("CheckLocation", checkLocation);
	socket.on("IndexRequest", emitIndex);
	socket.on("ReceiveReply", receiveReply);
	socket.emit("IndexRequest");
	ellipse(mouseX, mouseY, 20, 20);
	makeRect();
	print("my id: " + userID);
	print("index: " + index);
}

function emitIndex() {
	print("hi");
	socket.emit("ReceiveReply", index, userID);
}

function receiveReply(ind, ID) {
	print("ind " + ind + " id " + ID);
	if (ID != userID) {
		index = ind;
		makeRect();
	}
}

function draw() {
	//background(255, 204, 0);
	ellipse(mouseX, mouseY, 20, 20);
	//lets tell socket to send a message every time we draw an ellipse
	//with the coordinates of our mouse
	socket.emit("IamDrawing", mouseX, mouseY);

	//makeRect();

	checkLocation(mouseX, mouseY, userID);
	socket.emit("CheckLocation", mouseX, mouseY, userID);
}

function checkLocation(mouseX, mouseY, ID) {
	if (isInRect(mouseX, mouseY)) {
		print("one");
		if (ids[ID] == false) {
			count++;
			print("incrementing count for ID: " + ID + " to " + count);

		}
		ids[ID] = true;
	} else {
		print("two");
		if (ids[ID] == true) {
			count--;
			print("decrementing count for ID: " + ID + " to " + count);
		}
		ids[ID] = false;
	}
	if (count >= threshold) {
		print("three");
		x = locations[index][0];
		y = locations[index][1];
		ellipse(500, 500, size, size);
		index++;
		if (index >= locations.length) index = 0;
		makeRect();
		//count = 0;
		//resetIDList();
		print("enough users, new index: " + index);
	}
}

function resetIDList() {
	count = 0;
	for (var i = 0; i < ids.length; i++) {
		ids[i] = false
	}
}

function makeRect() {
	x = locations[index][0];
	y = locations[index][1];
	background(255, 204, 0);
	rect(x, y, 100, 100);
}

function isInRect(mouseX, mouseY) {
	x = locations[index][0];
		y = locations[index][1];
	if ((mouseX < size + x) && (mouseX > size) && (mouseY < size + y) && (mouseY > size)){
		print("tr");
	} else print("false");
	return (mouseX < size + x) && (mouseX > size) && (mouseY < size + y) && (mouseY > size);
}

//this function will be run every time a message is received
function drawEllipse(x, y) {
	ellipse(x, y, 20, 20);
}