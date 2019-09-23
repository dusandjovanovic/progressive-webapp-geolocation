const Room = require("../models/room");
const User = require("../models/user");
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
		case "/api/room/get/name/get": {
			return [
				param("name")
					.exists()
					.isString()
					.custom(async value => {
						return (await Room.isRoomByName(value))
							? Promise.resolve()
							: Promise.reject();
					})
			];
		}
		case "/api/room/create/post": {
			return [
				body("name")
					.exists()
					.isString(),
				body("roomType")
					.exists()
					.isString(),
				body("createdBy")
					.exists()
					.isString()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					})
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
					})
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
		case "/api/room/id/put": {
			return [
				param("id")
					.exists()
					.isString()
					.isMongoId(),
				body("payload").exists()
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

exports.getRoomByName = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { name } = request.params;

	Room.findOne({ name: name }, function(error, room) {
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

exports.putData = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { id } = request.params;
	const { payload } = request.body;

	Room.findOneAndUpdate(
		{ _id: id },
		{
			$push: {
				roomData: payload
			}
		},
		{ new: true },
		function(error, room) {
			if (error) return next(error);
			else {
				response.json({
					success: true,
					data: {
						...room.toObject()
					}
				});
			}
		}
	);
};

exports.postCreate = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { name, createdBy, roomType } = request.body;

	Room.create(
		{
			name: name,
			currentUsers: 1,
			users: [createdBy],
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

	const { roomName, username } = request.body;

	Room.findOne({ name: roomName }, function(error, room) {
		if (error) return next(error);
		else if (!room)
			return next({
				message: "Room with the name provided was not found."
			});
		else {
			if (room.users.indexOf(username) === -1)
				Room.update(
					{ name: roomName },
					{
						currentUsers: room.currentUsers + 1,
						$push: { users: username }
					},
					function(error) {
						if (error) return next(error);
						else
							response.json({
								success: true,
								message: username + " has joined the room."
							});
					}
				);
			else
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
			if (room.users.includes(username)) {
				const users = room.users.filter(user => user !== username);
				const currentUsers = room.currentUsers - 1;
				Room.update(
					{ name: roomName },
					{
						currentUsers: currentUsers,
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
