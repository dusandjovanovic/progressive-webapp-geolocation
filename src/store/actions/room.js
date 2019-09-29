import {
	axios,
	roomJoinRoute,
	roomLeaveRoute,
	roomGetAllRoute,
	roomGetDataRoute,
	roomCreateNewRoute,
	roomChangeMetadataRoute,
	roomAddMetadataRoute,
	roomGetMetadataRoute,
	roomAddMessageRoute
} from "../../utils/constantsAPI";

import {
	ROOM_INIT,
	ROOM_END,
	ROOM_DATA,
	ROOM_ALL,
	ROOM_CREATE,
	ROOM_ADD,
	ROOM_JOIN,
	ROOM_LEAVE,
	ROOM_ERROR,
	ROOM_MESSAGE_ADD,
	ROOM_METADATA_CHANGE,
	ROOM_METADATA_ADD,
	ROOM_USER_CHANGED,
	ROOM_USER_ENTERED,
	ROOM_USER_LEFT
} from "../actions.js";
import { internalNotificationsAdd } from "./internal";

const roomCreate = name => {
	return {
		type: ROOM_CREATE,
		name: name
	};
};

const roomAdd = room => {
	return {
		type: ROOM_ADD,
		room: room
	};
};

const roomJoin = (name, master = false) => {
	return {
		type: ROOM_JOIN,
		name: name,
		master: master
	};
};

const roomLeave = username => {
	return {
		type: ROOM_LEAVE,
		username: username
	};
};

const roomInitiate = () => {
	return {
		type: ROOM_INIT
	};
};

const roomEnd = () => {
	return {
		type: ROOM_END
	};
};

const roomData = (data, overwriteMetadata) => {
	return {
		type: ROOM_DATA,
		data: data,
		overwriteMetadata: overwriteMetadata
	};
};

const roomAll = rooms => {
	return {
		type: ROOM_ALL,
		rooms: rooms
	};
};

const roomError = error => {
	return {
		type: ROOM_ERROR,
		error: error
	};
};

const roomUserEntered = user => {
	return {
		type: ROOM_USER_ENTERED,
		user: user
	};
};

const roomUserChanged = user => {
	return {
		type: ROOM_USER_CHANGED,
		user: user
	};
};

const roomUserLeft = username => {
	return {
		type: ROOM_USER_LEFT,
		username: username
	};
};

const roomMessageAdd = payload => {
	return {
		type: ROOM_MESSAGE_ADD,
		payload: payload
	};
};

const roomMetadataAdd = payload => {
	return {
		type: ROOM_METADATA_ADD,
		payload: payload
	};
};

const roomMetadataChange = data => {
	return {
		type: ROOM_METADATA_CHANGE,
		data: data
	};
};

export const roomGetAll = (mode = "all") => {
	return async dispatch => {
		let response;

		try {
			response = await axios.getInstance().get(roomGetAllRoute(mode));

			if (response.data.success) {
				dispatch(roomAll(response.data.data));
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomGetData = (id, overwriteMetadata = true) => {
	return async dispatch => {
		let response;

		try {
			response = await axios.getInstance().get(roomGetDataRoute(id));

			if (response.data.success) {
				dispatch(roomData(response.data.data, overwriteMetadata));
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomCreateNew = (name, roomType) => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());
		const payload = {
			name: name,
			roomType: roomType,
			createdBy: getState().auth.username
		};

		try {
			const response = await axios
				.getInstance()
				.post(roomCreateNewRoute, payload, {
					"Content-Type": "application/x-www-form-urlencoded"
				});

			if (response.data.success) {
				const roomData = await dispatch(roomGetData(name));
				dispatch(roomAdd(roomData.data.data));
				dispatch(roomCreate(roomData.data.data.name));
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}
	};
};

export const roomJoinExisting = (id, name, latitude = 0.0, longitude = 0.0) => {
	return async (dispatch, getState) => {
		const username = getState().auth.username;

		dispatch(roomInitiate());
		const payload = {
			roomName: name,
			username: username,
			latitude: latitude,
			longitude: longitude
		};

		try {
			const response = await axios
				.getInstance()
				.post(roomJoinRoute, payload, {
					"Content-Type": "application/x-www-form-urlencoded"
				});

			if (response.data.success) {
				const roomData = await dispatch(roomGetData(id));
				dispatch(
					roomJoin(
						roomData.data.data.name,
						roomData.data.data.createdBy === username
					)
				);
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}
	};
};

export const roomLeaveExisting = () => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());
		const payload = {
			roomName: getState().room.data.name,
			username: getState().auth.username
		};
		let response;

		try {
			response = await axios.getInstance().post(roomLeaveRoute, payload, {
				"Content-Type": "application/x-www-form-urlencoded"
			});

			if (response.data.success) {
				dispatch(roomLeave(getState().auth.username));
				dispatch(roomAll(response.data.rooms));
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomGetMetadata = () => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());
		const id = getState().room.data._id;
		let response;

		try {
			response = await axios.getInstance().get(roomGetMetadataRoute(id));

			if (response.data.success) {
				dispatch(roomMetadataChange(response.data.data));
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomChangeMetadata = metadata => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());
		const id = getState().room.data._id;
		let response;
		const payload = {
			roomData: metadata
		};

		try {
			response = await axios
				.getInstance()
				.put(roomChangeMetadataRoute(id), payload, {
					"Content-Type": "application/x-www-form-urlencoded"
				});

			if (response.data.success) {
				dispatch(roomMetadataChange(metadata));
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomAddMetadata = (
	name,
	value,
	amenity,
	latitude = 0.0,
	longitude = 0.0
) => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());

		const id = getState().room.data._id;
		let response;
		const payload = {
			metaobject: {
				properties: {
					name,
					value,
					amenity,
					time: new Date(),
					author: getState().auth.username
				},
				geometry: {
					type: "Point",
					coordinates: [latitude, longitude]
				}
			}
		};

		try {
			response = await axios
				.getInstance()
				.put(roomAddMetadataRoute(id), payload, {
					"Content-Type": "application/x-www-form-urlencoded"
				});

			if (response.data.success) {
				dispatch(roomMetadataAdd(response.data.data));
				dispatch(roomEnd());
				dispatch(
					internalNotificationsAdd(
						"You just added a new insight. Others in the room will see it as well.",
						"success"
					)
				);
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomPushMetadata = (metaobject, pushNotification = false) => {
	return async dispatch => {
		dispatch(roomInitiate());
		dispatch(roomMetadataAdd(metaobject));
		dispatch(roomEnd());
		if (pushNotification)
			dispatch(
				internalNotificationsAdd(
					metaobject.properties.author +
						" just added a new insight. You can see it on the map now!",
					"info"
				)
			);
	};
};

export const roomAddMessage = message => {
	return async (dispatch, getState) => {
		dispatch(roomInitiate());

		const id = getState().room.data._id;
		let response;
		const payload = {
			sender: getState().auth.username,
			message: message
		};

		try {
			response = await axios
				.getInstance()
				.put(roomAddMessageRoute(id), payload, {
					"Content-Type": "application/x-www-form-urlencoded"
				});
			if (response.data.success) {
				dispatch(roomMessageAdd(response.data.data));
				dispatch(roomEnd());
			} else {
				dispatch(roomError(response.data.message));
			}
		} catch (error) {
			dispatch(roomError(error.response.data.message));
		}

		return response;
	};
};

export const roomPushMessage = message => {
	return async dispatch => {
		dispatch(roomInitiate());
		dispatch(roomMessageAdd(message));
		dispatch(roomEnd());
	};
};

export const roomAddNewUser = user => {
	return async dispatch => {
		dispatch(roomInitiate());
		dispatch(roomUserEntered(user));
		dispatch(roomEnd());
	};
};

export const roomChangeUser = user => {
	return async dispatch => {
		dispatch(roomInitiate());
		dispatch(roomUserChanged(user));
		dispatch(roomEnd());
	};
};

export const roomDeleteUser = username => {
	return async dispatch => {
		dispatch(roomInitiate());
		dispatch(roomUserLeft(username));
		dispatch(roomEnd());
	};
};
