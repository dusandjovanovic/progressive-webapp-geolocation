const User = require("../models/user");
const Room = require("../models/room");
const { validationResult, body, param } = require("express-validator");

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

	Room.find({ roomData: { "properties.author": username } }, function(
		error,
		data
	) {
		console.log(data);
		if (error) return next(error);
		else {
			let subMetaobjects = [];
			for (let i = 0; i < data.length; i++)
				for (let j = 0; j < data.roomData.length; j++)
					if (data[i].roomData[j].properties.author === username)
						subMetaobjects.push(data[i].roomData[j]);
			response.json({
				success: true,
				data: subMetaobjects
			});
		}
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
