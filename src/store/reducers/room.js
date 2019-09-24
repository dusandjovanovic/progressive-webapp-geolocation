import {
	ROOM_INIT,
	ROOM_END,
	ROOM_DATA,
	ROOM_METADATA_ADD,
	ROOM_METADATA_CHANGE,
	ROOM_ALL,
	ROOM_CREATE,
	ROOM_ADD,
	ROOM_JOIN,
	ROOM_LEAVE,
	ROOM_ERROR
} from "../actions.js";

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
			let rooms = state.rooms.map(room => ({
				...room
			}));
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
					graph: action.overwriteGraph
						? action.data.graph
						: state.data.graph
				},
				room: {
					...state.room,
					master: action.master
				}
			};
		case ROOM_METADATA_ADD: {
			let roomData = [...state.data.roomData];
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
