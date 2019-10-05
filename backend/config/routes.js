"use strict";

const home = require("../app/controllers/home");
const user = require("../app/controllers/user");
const room = require("../app/controllers/room");
const friendRequest = require("../app/controllers/friend-request");

module.exports = function(app, passport) {
	global.passport = passport;

	app.get("/", home.index);

	app.post("/api/logout", authenticated, user.logout);

	app.post(
		"/api/register",
		user.validate("/authenticate/api/register/post"),
		user.register
	);

	app.post(
		"/api/login",
		user.validate("/authenticate/api/login/post"),
		user.login
	);

	app.get(
		"/api/user/:username",
		authenticated,
		user.validate("/api/user/username/get"),
		user.get
	);

	app.get(
		"/api/user/:username/history",
		authenticated,
		user.validate("/api/user/username/history/get"),
		user.getHistory
	);

	app.get(
		"/api/friend-request/:username",
		authenticated,
		friendRequest.validate("/api/friend-request/username/get"),
		friendRequest.get
	);

	app.post(
		"/api/friend-request/check",
		authenticated,
		friendRequest.validate("/api/friend-request/check/post"),
		friendRequest.postCheck
	);

	app.post(
		"/api/friend-request/add",
		authenticated,
		friendRequest.validate("/api/friend-request/add/post"),
		friendRequest.postAdd
	);

	app.post(
		"/api/friend-request/confirm",
		authenticated,
		friendRequest.validate("/api/friend-request/confirm/post"),
		friendRequest.postConfirm
	);

	app.delete(
		"/api/friend-request/:id",
		authenticated,
		friendRequest.validate("/api/friend-request/id/delete"),
		friendRequest.delete
	);

	app.get(
		"/api/room/:mode",
		authenticated,
		room.validate("/api/room/mode/get"),
		room.get
	);

	app.get(
		"/api/room/get/:id",
		authenticated,
		room.validate("/api/room/id/get"),
		room.getRoomById
	);

	app.put(
		"/api/room/:id",
		authenticated,
		room.validate("/api/room/id/put"),
		room.putData
	);

	app.get(
		"/api/room/metadata/:id",
		authenticated,
		room.validate("/api/room/metadata/get"),
		room.getMetdata
	);

	app.put(
		"/api/room/metadata/:id",
		authenticated,
		room.validate("/api/room/metadata/put"),
		room.putMetadata
	);

	app.put(
		"/api/room/location/:id",
		authenticated,
		room.validate("/api/room/location/put"),
		room.putLocation
	);

	app.put(
		"/api/room/messages/:id",
		authenticated,
		room.validate("/api/room/messages/put"),
		room.putMessage
	);

	app.post(
		"/api/room/create",
		authenticated,
		room.validate("/api/room/create/post"),
		room.postCreate
	);

	app.post(
		"/api/room/join",
		authenticated,
		room.validate("/api/room/join/post"),
		room.postJoin
	);

	app.post(
		"/api/room/leave",
		authenticated,
		room.validate("/api/room/leave/post"),
		room.postLeave
	);

	app.delete(
		"/api/room/:id",
		authenticated,
		room.validate("/api/room/id/delete"),
		room.delete
	);

	app.use(function(error, request, response, next) {
		if (error.errmsg) {
			response.status(400).send({ message: error.errmsg });
		} else if (error.msg) {
			response.status(400).send({ message: error.msg });
		} else if (error.validation) {
			response.status(400).send({
				message:
					"Error(400) Bad Request: Your request is missing" +
					String(
						Object.keys(error.validation).map(
							element =>
								` ${error.validation[element].location}[${error.validation[element].param}]`
						)
					)
			});
		} else if (error.message) {
			response.status(500).send(error);
		} else {
			return next();
		}
	});

	app.use(function(request, response) {
		response.status(404).send({
			message:
				"Error(404) Not Found: Something went wrong or you provided the wrong path."
		});
	});

	function authenticated(request, response, next) {
		if (request.isAuthenticated()) return next();
		else
			response.status(401).send({
				message:
					"Error(401) Unauthorized: Non-auth access is denied for this endpoint."
			});
	}
};
