const io = require("socket.io")(65080);
require("./socketio/chat-io")(io);
require("./socketio/map-io")(io);
module.exports = io;
