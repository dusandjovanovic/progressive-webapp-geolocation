import React from "react";
import socketio from "socket.io-client";
import PropTypes from "prop-types";
import { backendIOMap } from "../../utils/constantsAPI";

const withIO = WrappedComponent => {
	class WIthIO extends React.Component {
		socket = null;
		io = socketio;

		constructor(props) {
			super(props);
			this.socket = this.io(backendIOMap, { transports: ["websocket"] });
			this.state = {
				redirect: false
			};
		}

		componentDidMount() {
			this.initWebsocketIO();

			this.socket.on("joinRoom", received => {
				this.props.roomGetData(this.props.data._id, false);
				this.props.internalNotificationsAdd(received.message, "info");
			});

			this.socket.on("leaveRoom", received => {
				this.props.roomDeleteUser(received.username);
				this.props.internalNotificationsAdd(received.message, "info");
			});

			this.socket.on("addMetadata", received => {
				this.props.roomPushMetadata(received.metadata, true);
			});

			this.socket.on("addLocationChange", received => {
				this.props.roomChangeUser({
					username: received.sender,
					location: received.location
				});
			});

			this.joinRoomIO(
				this.props.data.name,
				this.props.username,
				this.props.username + " has just joined the room."
			);

			window.addEventListener("beforeunload", this.leaveRoomIOInit);
		}

		componentWillUnmount() {
			this.socket.close();
			window.removeEventListener("beforeunload", this.leaveRoomIOInit);
		}

		initWebsocketIO = () => {
			this.socket.emit("initWebsocket", {
				room: this.props.data.name
			});
		};

		addMetadataIO = metadata => {
			this.socket.emit("addMetadata", {
				room: this.props.data.name,
				sender: this.props.username,
				metadata: metadata
			});
		};

		changeMetadataIO = metadata => {
			if (metadata) {
				this.socket.emit("changeMetadata", {
					room: this.props.data.name,
					metadata: metadata
				});
			}
		};

		addLocationChangeIO = location => {
			if (location) {
				this.socket.emit("addLocationChange", {
					room: this.props.data.name,
					sender: this.props.username,
					location: location
				});
			}
		};

		joinRoomIO = (room, username, message) => {
			this.socket.emit("joinRoom", {
				room: room,
				username: username,
				message: message
			});
		};

		leaveRoomIO = (room, username, message) => {
			this.socket.emit("leaveRoom", {
				room: room,
				username: username,
				message: message
			});
		};

		leaveRoomIOInit = async () => {
			this.leaveRoomIO(
				this.props.data.name,
				this.props.username,
				this.props.username + " has just left the room."
			);
			await this.props.roomLeaveExisting();
			this.setState({
				redirect: true
			});
			return "unloading";
		};

		render() {
			return (
				<WrappedComponent
					io={this.io}
					initWebsocketIO={this.initWebsocketIO}
					addMetadataIO={this.addMetadataIO}
					changeMetadataIO={this.changeMetadataIO}
					addLocationChangeIO={this.addLocationChangeIO}
					joinRoomIO={this.joinRoomIO}
					leaveRoomIO={this.leaveRoomIO}
					leaveRoomIOInit={this.leaveRoomIOInit}
					socket={this.socket}
					redirect={this.state.redirect}
					{...this.props}
				/>
			);
		}
	}

	WIthIO.propTypes = {
		username: PropTypes.string,
		data: PropTypes.object,
		roomGetData: PropTypes.func.isRequired,
		roomLeaveExisting: PropTypes.func.isRequired,
		roomPushMetadata: PropTypes.func.isRequired,
		roomChangeMetadata: PropTypes.func.isRequired,
		roomAddMetadata: PropTypes.func.isRequired,
		roomAddMetadataMedia: PropTypes.func.isRequired,
		roomGetMetadata: PropTypes.func.isRequired,
		roomAddNewUser: PropTypes.func.isRequired,
		roomChangeUser: PropTypes.func.isRequired,
		roomDeleteUser: PropTypes.func.isRequired,
		userHistoryAdd: PropTypes.func.isRequired,
		roomAddMessage: PropTypes.func.isRequired,
		roomPushMessage: PropTypes.func.isRequired,
		roomAddLocation: PropTypes.func.isRequired,
		internalNotificationsAdd: PropTypes.func.isRequired
	};

	return WIthIO;
};

export default withIO;
