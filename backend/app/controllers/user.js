const User = require("../models/user");
const Room = require("../models/room");
const { validationResult, body, param } = require("express-validator");
const constants = require("../../config/constants");

exports.validate = method => {
	switch (method) {
		case "/authenticate/api/register/post": {
			return [body("username").exists(), body("password").exists()];
		}
		case "/authenticate/api/login/post": {
			return [body("username").exists(), body("password").exists()];
		}
		case "/api/user/username/get": {
			return [
				param("username")
					.exists()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					})
			];
		}
		case "/api/user/username/history/get": {
			return [
				param("username")
					.exists()
					.custom(async value => {
						return (await User.isUserByUsername(value))
							? Promise.resolve()
							: Promise.reject();
					})
			];
		}
		default: {
			return [];
		}
	}
};

exports.changeLocation = function(username, latitude, longitude, callback) {
	User.findOneAndUpdate(
		{ username: username },
		{
			$set: {
				location: {
					type: "Point",
					coordinates: [latitude, longitude]
				}
			}
		},
		function(error, user) {
			if (error) return callback(error);
			else return callback(null, user.toObject().location);
		}
	);
};

exports.isNearLocation = function(username, latitude, longitude, callback) {
	User.findOne({ username: username }, function(error, user) {
		if (error) return callback(error);
		else {
			const latitude = user.toObject().location[0];
			const longitude = user.toObject().location[1];
			return callback(null, constants.DISTANCE(latitude, longitude) < 10);
		}
	});
};

exports.get = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { username } = request.params;

	User.findOne({ username: username }, function(error, user) {
		if (error) return next(error);
		else if (!user)
			return next({
				message: "User with username provided does not exist."
			});
		else
			response.json({
				success: true,
				data: user
			});
	});
};

exports.getHistory = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { username } = request.params;

	User.findOne({ username: username }, function(error, user) {
		if (error) return next(error);
		const userHistory = [];
		const friendHistory = [];
		const statistics = [
			{
				title: constants.ROOM_NAME_POLLUTION_SHORT,
				amount: 0
			},
			{
				title: constants.ROOM_NAME_PLACES_SHORT,
				amount: 0
			},
			{
				title: constants.ROOM_NAME_TRAFFIC_SHORT,
				amount: 0
			}
		];

		Room.find({}, function(error, data) {
			if (error) return next(error);
			for (let i = 0; i < data.length; i++) {
				for (let j = 0; j < data[i].roomData.length; j++) {
					const metaobject = data[i].roomData[j];
					if (metaobject.properties.author === username)
						userHistory.push(metaobject);
					else if (
						user.friends &&
						user.friends.length &&
						user.friends.includes(metaobject.properties.author)
					)
						friendHistory.push(metaobject);
					if (data[i].roomType === constants.ROOM_TYPE_POLLUTION)
						statistics[0].amount += 1;
					else if (data[i].roomType === constants.ROOM_TYPE_PLACES)
						statistics[1].amount += 1;
					else if (data[i].roomType === constants.ROOM_TYPE_TRAFFIC)
						statistics[2].amount += 1;
				}
			}
			response.json({
				success: true,
				data: {
					userHistory,
					friendHistory,
					statistics
				}
			});
		});
	});
};

exports.register = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	const { username, password } = request.body;

	User.register(new User({ username: username }), password, function(error) {
		if (error) {
			response.status(500).send(error);
		} else {
			global.passport.authenticate("local", function(error, user, info) {
				if (error) return next(error);
				else if (!user) return next(info);
				request.login(user, function(error) {
					if (error) return next(error);
					response.json({
						success: true,
						user: user
					});
				});
			})(request, response, next);
		}
	});
};

exports.login = function(request, response, next) {
	const validation = validationResult(request);
	if (!validation.isEmpty()) return next({ validation: validation.mapped() });

	global.passport.authenticate("local", function(error, user, info) {
		if (error) return next(error);
		else if (!user) return next(info);
		request.login(user, function(error) {
			if (error) return next(error);
			response.json({
				success: true,
				user: user
			});
		});
	})(request, response, next);
};

exports.logout = function(request, response) {
	request.logout();
	response.json({
		success: true
	});
};
