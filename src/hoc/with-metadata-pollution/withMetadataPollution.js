import React from "react";
import MetadataPollution from "../../containers/room/metadata/metadataPollution";
import MarkerPollution from "../../containers/room/markers/marker-pollution/markerPollution";
import PropTypes from "prop-types";

const withMetadataPollution = WrappedComponent => {
	class withMetadataPollution extends React.Component {
		state = {
			markersMetadata: null,
			newMetadata: false
		};

		componentDidMount() {
			this.renderMarkers();
			this.props.initWebsocketIO();

			this.props.socket.on("joinRoom", received => {
				this.props.roomGetData(this.props.data._id, false);
				this.props.internalNotificationsAdd(received.message, "info");
			});

			this.props.socket.on("leaveRoom", received => {
				this.props.roomDeleteUser(received.username);
				this.props.internalNotificationsAdd(received.message, "info");
			});

			this.props.socket.on("addMetadata", received => {
				this.props.roomPushMetadata(received.metadata, true);
			});

			this.props.socket.on("addLocationChange", received => {
				this.props.roomChangeUser({
					username: received.sender,
					location: received.location
				});
			});

			this.props.joinRoomIO(
				this.props.room.name,
				this.props.username,
				this.props.username + " has just joined the room."
			);
		}

		componentDidUpdate(prevProps) {
			if (this.props.data.roomData !== prevProps.data.roomData)
				this.renderMarkers();
		}

		renderMarkers = () => {
			if (this.props.data && this.props.data.roomData)
				this.setState({
					markersMetadata: this.props.data.roomData.map(
						(element, index) => (
							<MarkerPollution
								key={element._id}
								element={element}
								index={index}
							/>
						)
					)
				});
		};

		handleNewMetadataOpen = () => {
			this.setState({
				newMetadata: true
			});
		};

		handleNewMetadataClose = () => {
			this.setState({
				newMetadata: false
			});
		};

		handleMetadata = async (name, value, amenity) => {
			const response = await this.props.roomAddMetadata(
				name,
				value,
				amenity,
				this.props.location.latitude,
				this.props.location.longitude
			);
			if (response.data && response.data.data)
				this.props.addMetadataIO(response.data.data);
		};

		render() {
			return (
				<WrappedComponent
					markersMetadata={this.state.markersMetadata}
					roomAddMetadataInit={this.handleNewMetadataOpen}
					{...this.props}
				>
					<MetadataPollution
						open={this.state.newMetadata}
						handleModalClose={this.handleNewMetadataClose}
						handleMetadata={this.handleMetadata}
					/>
				</WrappedComponent>
			);
		}
	}

	withMetadataPollution.propTypes = {
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
		roomAddMessage: PropTypes.func.isRequired,
		roomPushMessage: PropTypes.func.isRequired,
		internalNotificationsAdd: PropTypes.func.isRequired,
		io: PropTypes.func.isRequired,
		initWebsocketIO: PropTypes.func.isRequired,
		addMetadataIO: PropTypes.func.isRequired,
		changeMetadataIO: PropTypes.func.isRequired,
		addLocationChangeIO: PropTypes.func.isRequired,
		joinRoomIO: PropTypes.func.isRequired,
		leaveRoomIO: PropTypes.func.isRequired,
		leaveRoomIOInit: PropTypes.func.isRequired,
		socket: PropTypes.object.isRequired,
		redirect: PropTypes.bool.isRequired,
		location: PropTypes.object.isRequired
	};

	return withMetadataPollution;
};

export default withMetadataPollution;
