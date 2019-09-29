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
			this.socket = this.io(backendIOMap);
			this.state = {
				redirect: false
			};
		}

		componentDidMount() {
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
					room: this.props.room.name,
					metadata: metadata
				});
			}
		};

		addLocationChangeIO = location => {
			if (location) {
				this.socket.emit("addLocationChange", {
					room: this.props.room.name,
					sender: this.props.username,
					location: location
				});
			}
		};

		joinLeaveRoomIO = (roomName, message) => {
			this.socket.emit("joinLeaveRoom", {
				room: roomName,
				message: message
			});
		};

		leaveRoomIOInit = async () => {
			const roomName = this.props.room.name;
			const response = await this.props.roomLeaveExisting(false);
			this.joinLeaveRoomIO(roomName, response.data.message);
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
					joinLeaveRoomIO={this.joinLeaveRoomIO}
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
		room: PropTypes.object,
		roomGetData: PropTypes.func.isRequired,
		roomLeaveExisting: PropTypes.func.isRequired,
		roomPushMetadata: PropTypes.func.isRequired,
		roomChangeMetadata: PropTypes.func.isRequired,
		roomAddMetadata: PropTypes.func.isRequired,
		roomGetMetadata: PropTypes.func.isRequired,
		roomAddNewUser: PropTypes.func.isRequired,
		roomChangeUser: PropTypes.func.isRequired,
		roomDeleteUser: PropTypes.func.isRequired,
		userHistoryAdd: PropTypes.func.isRequired,
		internalNotificationsAdd: PropTypes.func.isRequired
	};

	return WIthIO;
};

export default withIO;
