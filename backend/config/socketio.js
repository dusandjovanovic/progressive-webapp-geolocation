module.exports = function(server) {
	const io = require("socket.io")(server);
	require("./socketio/chat-io")(io);
	require("./socketio/map-io")(io);
	module.exports = io;
};
