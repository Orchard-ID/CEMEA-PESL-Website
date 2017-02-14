/* global NA */
var socket = NA.socket;
socket.emit("websocket", {
	str: "test"
});
socket.on("websocket", function (data) {
	console.log(data.str);
});