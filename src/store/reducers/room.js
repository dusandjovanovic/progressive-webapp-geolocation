import {
	ROOM_INIT,
	ROOM_END,
	ROOM_DATA,
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

import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";

const initialState = {
	rooms: [],
	room: {
		name: null,
		master: false
	},
	data: {
		_id: null,
		users: [],
		roomData: []
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
					name: action.name,
					master: true
				}
			};
		case ROOM_ADD: {
			let rooms = cloneDeep(state.rooms);
			rooms.push(action.room);
			return {
				...state,
				rooms: rooms
			};
		}
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
					...state.room,
					master: action.master
				}
			};
		case ROOM_METADATA_ADD: {
			let roomData = cloneDeep(state.data.roomData);
			roomData.push(action.payload);
			return {
				...state,
				data: {
					...state.data,
					roomData: roomData
				}
			};
		}
		case ROOM_METADATA_CHANGE: {
			return {
				...state,
				data: {
					...action.data
				}
			};
		}
		case ROOM_USER_ENTERED: {
			let users = cloneDeep(state.data.users);
			users.push(action.user);
			return {
				...state,
				data: {
					...state.data,
					users: users
				}
			};
		}
		case ROOM_USER_LEFT:
			return {
				...state,
				data: {
					...state.data,
					users: filter(state.data.users, {
						username: !action.username
					})
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
					name: action.name,
					master: action.master
				}
			};
		case ROOM_LEAVE:
			return {
				...state,
				room: {
					name: null,
					master: false
				},
				data: {
					_id: null,
					graph: null,
					users: []
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
