module.exports = function(io) {
	const map = io.of("/map");

	map.on("connection", socket => {
		socket.on("initWebsocket", from => {
			socket.join(from.room);
			socket.broadcast.to(from.room).emit("initMember");
		});

		socket.on("changeMetadata", from => {
			socket.broadcast
				.to(from.room)
				.emit("changeMetadata", { metadata: from.metadata });
		});

		socket.on("addMetadata", from => {
			socket.broadcast.to(from.room).emit("addMetadata", {
				sender: from.sender,
				metadata: from.metadata
			});
		});

		socket.on("joinRoom", from => {
			socket.broadcast
				.to(from.room)
				.emit(from.master, { username: from.username });
		});

		socket.on("joinLeaveRoom", from => {
			socket.broadcast.to(from.room).emit("joinLeaveRoom", {
				msg: from.msg
			});
		});
	});
};
