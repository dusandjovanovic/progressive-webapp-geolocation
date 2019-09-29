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

		socket.on("addLocationChange", from => {
			socket.broadcast.to(from.room).emit("addLocationChange", {
				sender: from.sender,
				location: from.location
			});
		});

		socket.on("joinLeaveRoom", from => {
			socket.broadcast.to(from.room).emit("joinLeaveRoom", {
				message: from.message
			});
		});
	});
};
