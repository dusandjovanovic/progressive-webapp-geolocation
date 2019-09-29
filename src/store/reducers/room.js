import {
	ROOM_INIT,
	ROOM_END,
	ROOM_DATA,
	ROOM_MESSAGE_ADD,
	ROOM_METADATA_ADD,
	ROOM_METADATA_CHANGE,
	ROOM_USER_CHANGED,
	ROOM_USER_ENTERED,
	ROOM_USER_LEFT,
	ROOM_ALL,
	ROOM_CREATE,
	ROOM_ADD,
	ROOM_JOIN,
	ROOM_LEAVE,
	ROOM_ERROR
} from "../actions.js";

import filter from "lodash/filter";

const initialState = {
	rooms: [],
	room: {
		name: null
	},
	data: {
		_id: null,
		users: [],
		roomData: [],
		roomMessages: []
	},
	waiting: false,
	error: null
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ROOM_INIT:
			return {
				...state,
				waiting: true,
				error: null
			};
		case ROOM_END:
			return {
				...state,
				waiting: false,
				error: null
			};
		case ROOM_ALL:
			return {
				...state,
				rooms: [...action.rooms]
			};
		case ROOM_CREATE:
			return {
				...state,
				room: {
					name: action.name
				}
			};
		case ROOM_ADD:
			return {
				...state,
				rooms: [...state.rooms, action.room]
			};

		case ROOM_DATA:
			return {
				...state,
				data: {
					...state.data,
					...action.data,
					roomData: action.overwriteMetadata
						? action.data.roomData
						: state.data.roomData
				},
				room: {
					...state.room
				}
			};
		case ROOM_MESSAGE_ADD:
			return {
				...state,
				data: {
					...state.data,
					roomMessages: [...state.data.roomMessages, action.payload]
				}
			};
		case ROOM_METADATA_ADD:
			return {
				...state,
				data: {
					...state.data,
					roomData: [...state.data.roomData, action.payload]
				}
			};
		case ROOM_METADATA_CHANGE: {
			return {
				...state,
				data: {
					...action.data
				}
			};
		}
		case ROOM_USER_ENTERED:
			return {
				...state,
				data: {
					...state.data,
					users: [...state.data.users, action.user]
				}
			};
		case ROOM_USER_LEFT:
			return {
				...state,
				data: {
					...state.data,
					users: filter(
						state.data.users,
						element => element.username !== action.username
					)
				}
			};
		case ROOM_USER_CHANGED:
			return {
				...state,
				data: {
					...state.data,
					users: state.data.users.map(element =>
						element.username === action.user.username
							? { ...action.user }
							: { ...element }
					)
				}
			};
		case ROOM_JOIN:
			return {
				...state,
				room: {
					name: action.name
				}
			};
		case ROOM_LEAVE:
			return {
				...state,
				room: {
					name: null
				},
				data: {
					_id: null,
					users: [],
					roomData: [],
					roomMessages: []
				}
			};
		case ROOM_ERROR:
			return {
				...state,
				waiting: false,
				error: action.error
			};

		default:
			return state;
	}
};

export default reducer;
