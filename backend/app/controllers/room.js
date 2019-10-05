const Room = require("../models/room");
const User = require("../models/user");
const UserController = require("../controllers/user");
const { validationResult, body, param } = require("express-validator");

exports.validate = method => {
	switch (method) {
		case "/api/room/mode/get": {
			return [
				param("mode")
					.exists()
					.isString()
					.isIn(["all", "learn", "practice", "compete"])
			];
		}
		case "/api/room/id/get": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId()
			];
		}
		case "/api/room/id/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("roomData").exists()
			];
		}
		case "/api/room/metadata/get": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId()
			];
		}
		case "/api/room/metadata/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("metaobject").exists()
			];
		}
		case "/api/room/metadata-media/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("name")
					.exists()
					.isString(),
				body("value")
					.exists()
					.isNumeric(),
				body("author")
					.exists()
					.isString(),
				body("latitude")
					.exists()
					.isNumeric(),
				body("longitude")
					.exists()
					.isNumeric(),
				body("time").exists(),
				body("media").exists()
			];
		}
		case "/api/room/location/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("username")
					.exists()
					.isString()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					}),
				body("latitude")
					.exists()
					.isNumeric(),
				body("longitude")
					.exists()
					.isNumeric()
			];
		}
		case "/api/room/messages/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("sender")
					.exists()
					.isString(),
				body("message")
					.exists()
					.isString()
			];
		}
		case "/api/room/create/post": {
			return [
				body("name")
					.exists()
					.isString(),
				body("roomType")
					.exists()
					.isString()
			];
		}
		case "/api/room/join/post": {
			return [
				body("username")
					.exists()
					.isString()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					}),
				body("roomName")
					.exists()
					.isString()
					.custom(async value => {
						return (await Room.isRoomByName(value))
							? Promise.resolve()
							: Promise.reject();
					}),
				body("latitude")
					.exists()
					.isNumeric(),
				body("longitude")
					.exists()
					.isNumeric()
			];
		}
		case "/api/room/leave/post": {
			return [
				body("username")
					.exists()
					.isString()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					}),
				body("roomName")
					.exists()
					.isString()
					.custom(async value => {
						return (await Room.isRoomByName(value))
							? Promise.resolve()
							: Promise.reject();
					})
			];
		}
		case "/api/room/id/delete": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId()
			];
		}
		default: {
			return [];
		}
	}
};

exports.get = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { mode } = request.params;

	if (mode == "all")
		Room.find(function(error, rooms) {
			if (error) return next(error);
			else
				response.json({
					success: true,
					data: rooms
				});
		});
	else
		Room.find({ roomType: mode }, function(error, rooms) {
			if (error) return next(error);
			else
				response.json({
					success: true,
					data: rooms
				});
		});
};

exports.getRoomById = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;

	Room.findById(id, function(error, room) {
		if (error) return next(error);
		else {
			response.json({
				success: true,
				data: {
					...room.toObject()
				}
			});
		}
	});
};

exports.putMessage = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { sender } = request.body;
	const { message } = request.body;

	Room.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				roomMessages: {
					sender,
					message
				}
			}
		},
		{ new: true },
		function(error, room) {
			if (error) return next(error);
			else {
				const roomMessages = room.roomMessages;
				response.json({
					success: true,
					data: roomMessages[roomMessages.length - 1]
				});
			}
		}
	);
};

exports.putMetadata = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { metaobject } = request.body;

	Room.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				roomData: metaobject
			}
		},
		{ new: true },
		function(error, room) {
			if (error) return next(error);
			else {
				const roomData = room.roomData;
				response.json({
					success: true,
					data: roomData[roomData.length - 1]
				});
			}
		}
	);
};

exports.putMetadataMedia = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { name, value, author, latitude, longitude, time } = request.body;
	const amenity =
		request.protocol + "://" + request.host + "/" + request.file.path;

	Room.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				roomData: {
					properties: {
						name,
						value,
						amenity,
						author,
						time
					},
					geometry: {
						type: "Point",
						coordinates: [latitude, longitude]
					}
				}
			}
		},
		{ new: true },
		function(error, room) {
			if (error) return next(error);
			else {
				const roomData = room.roomData;
				response.json({
					success: true,
					data: roomData[roomData.length - 1]
				});
			}
		}
	);
};

exports.getMetdata = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;

	Room.findById(id, function(error, room) {
		if (error) return next(error);
		else {
			response.json({
				success: true,
				data: room.roomData
			});
		}
	});
};

exports.putLocation = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { username } = request.body;
	const { latitude } = request.body;
	const { longitude } = request.body;

	Room.findOne({ _id: id }, function(error, room) {
		if (error) return next(error);
		else {
			const usersUpdated = room.toObject().users.map(element =>
				element.username === username
					? {
							...element,
							location: {
								type: "Point",
								coordinates: [latitude, longitude]
							}
					  }
					: element
			);
			Room.findOneAndUpdate(
				{ _id: id },
				{
					$set: {
						users: usersUpdated
					}
				},
				{ new: true },
				function(error, room) {
					if (error) return next(error);
					else {
						UserController.changeLocation(
							username,
							latitude,
							longitude,
							function(error) {
								if (error) return next(error);
								else
									response.json({
										success: true,
										data: room.toObject().users,
										delta: room
											.toObject()
											.users.find(
												element =>
													element.username ===
													username
											)
									});
							}
						);
					}
				}
			);
		}
	});
};

exports.putData = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { roomData } = request.body;

	Room.findOneAndUpdate(
		{ _id: id },
		{
			$set: {
				roomData: roomData
			}
		},
		function(error) {
			if (error) return next(error);
			else {
				response.json({
					success: true
				});
			}
		}
	);
};

exports.postCreate = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { name, roomType } = request.body;

	Room.create(
		{
			name: name,
			roomType: roomType,
			roomData: []
		},
		function(error) {
			if (error) return next(error);
			else
				response.json({
					success: true,
					message: "Room created successfully."
				});
		}
	);
};

exports.postJoin = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { roomName, username, latitude, longitude } = request.body;

	Room.findOne({ name: roomName }, function(error, room) {
		if (error) return next(error);
		else if (!room)
			return next({
				message: "Room with the name provided was not found."
			});
		else {
			let usersInRoom = room.users.map(element => element.username);
			if (!usersInRoom.includes(username)) {
				Room.updateOne(
					{ name: roomName },
					{
						$push: {
							users: {
								username: username,
								location: {
									type: "Point",
									coordinates: [latitude, longitude]
								}
							}
						}
					},
					function(error) {
						if (error) return next(error);
						else {
							UserController.changeLocation(
								username,
								latitude,
								longitude,
								function(error) {
									if (error) return next(error);
									else
										response.json({
											success: true,
											message:
												username +
												" has just joined the room."
										});
								}
							);
						}
					}
				);
			} else
				response.json({
					success: true,
					message: username + " has joined the room again."
				});
		}
	});
};

exports.postLeave = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { roomName, username } = request.body;

	Room.findOne({ name: roomName }, function(error, room) {
		if (error) return next(error);
		else if (!room)
			return next({
				message: "Room with the name provided was not found."
			});
		else {
			let usersInRoom = room.users.map(element => element.username);
			if (usersInRoom.includes(username)) {
				const users = room.users.filter(
					element => element.username !== username
				);
				Room.updateOne(
					{ name: roomName },
					{
						users: users
					},
					function(error) {
						if (error) return next(error);
						else
							Room.find(function(error, rooms) {
								if (error) return next(error);
								else
									response.json({
										success: true,
										message:
											username + " has left the room.",
										rooms: rooms
									});
							});
					}
				);
			} else
				return next({
					message:
						"User with the username provided is not in the room."
				});
		}
	});
};

exports.delete = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;

	Room.findOneAndDelete({ _id: id }, function(error) {
		if (error) return next(error);
		else {
			Room.find(function(error, rooms) {
				if (error) return next(error);
				else
					response.json({
						success: true,
						message: "Room deleted successfully.",
						rooms: rooms
					});
			});
		}
	});
};
