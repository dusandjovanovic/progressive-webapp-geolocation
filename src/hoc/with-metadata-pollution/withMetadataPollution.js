import React from "react";
import Typography from "@material-ui/core/Typography";
import MetadataPollution from "../../containers/room/metadata/metadataPollution";
import { CircleMarker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

import { IMPACT_COLORS, IMPACT_STRING_POLLUTION } from "../../utils/constants";

const withMetadataPollution = WrappedComponent => {
	class withMetadataPollution extends React.Component {
		state = {
			markersMetadata: null,
			newMetadata: false,
			error: {
				hasError: false,
				name: null,
				description: null
			}
		};

		componentDidMount() {
			this.renderMarkers();
			this.props.initWebsocketIO();

			this.props.socket.on("joinLeaveRoom", received => {
				this.props.roomGetData(this.props.data._id, false);
				this.props.internalNotificationsAdd(received.msg, "info");
			});

			this.props.socket.on("addMetadata", received => {
				this.props.roomPushMetadata(received.metadata, true);
			});

			this.props.joinRoomIO(
				this.props.username,
				this.props.data.createdBy
			);

			this.props.joinLeaveRoomIO(
				this.props.room.name,
				this.props.username + " has just joined the room."
			);
		}

		componentDidUpdate(prevProps) {
			if (this.props.data.roomData !== prevProps.data.roomData) {
				this.renderMarkers();
			}
		}

		renderMarkers = () => {
			if (this.props.data && this.props.data.roomData) {
				this.setState({
					markersMetadata: this.props.data.roomData.map(
						(element, index) => this.renderMarker(element, index)
					)
				});
			}
		};

		renderMarker = (element, index) => {
			return (
				<CircleMarker
					key={index}
					center={[
						element.geometry.coordinates[0],
						element.geometry.coordinates[1]
					]}
					radius={element.properties.value * 2.5}
					fillOpacity={0.5}
					stroke={false}
					color={IMPACT_COLORS[element.properties.value - 1]}
				>
					<Tooltip direction="bottom">
						<div>
							<Typography
								variant="caption"
								color="secondary"
								gutterBottom
							>
								{IMPACT_STRING_POLLUTION(
									element.properties.value
								)}
							</Typography>
						</div>

						<div>
							<Typography variant="caption">
								Shared by: {element.properties.author}
							</Typography>
						</div>

						<div>
							<Typography variant="body1">
								{element.properties.amenity}
							</Typography>
						</div>
					</Tooltip>
				</CircleMarker>
			);
		};

		handleNewMetadataOpen = () => {
			this.setState({
				newMetadata: true
			});
		};

		handleNewMetadataClose = () => {
			if (!this.state.error.hasError) {
				this.setState({
					newMetadata: false
				});
			}
		};

		handleMetadata = async (name, value, amenity) => {
			try {
				const metaobject = await this.props.roomAddMetadata(
					name,
					value,
					amenity,
					this.props.location.latitude,
					this.props.location.longitude
				);
				this.props.addMetadataIO(metaobject);
			} catch (error) {
				this.setState({
					error: {
						hasError: true,
						name: error.toString()
					}
				});
			}
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
		internalNotificationsAdd: PropTypes.func.isRequired,
		io: PropTypes.func.isRequired,
		initWebsocketIO: PropTypes.func.isRequired,
		addMetadataIO: PropTypes.func.isRequired,
		changeMetadataIO: PropTypes.func.isRequired,
		joinRoomIO: PropTypes.func.isRequired,
		joinLeaveRoomIO: PropTypes.func.isRequired,
		leaveRoomIOInit: PropTypes.func.isRequired,
		socket: PropTypes.object.isRequired,
		redirect: PropTypes.bool.isRequired,
		location: PropTypes.object.isRequired
	};

	return withMetadataPollution;
};

export default withMetadataPollution;
