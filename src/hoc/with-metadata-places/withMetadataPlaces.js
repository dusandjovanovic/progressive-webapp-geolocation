import React from "react";
import MetadataPlaces from "../../containers/room/metadata/metadata-places/metadataPlaces";
import MetadataFilter from "../../containers/room/metadata/metadata-filter/metadataFilter";
import MarkerPlace from "../../containers/room/markers/marker-place/markerPlace";
import PropTypes from "prop-types";

import {
	filterMetadataByTime,
	filterMetadataByDistance
} from "../../utils/functions/filteringFunctions";

const withMetadataPlaces = WrappedComponent => {
	class withMetadataPlaces extends React.Component {
		state = {
			metadata: [],
			markersMetadata: null,
			newMetadata: false,
			filterNearby: false,
			filterNearbyRadius: 100,
			filterRecent: false,
			filterRecentTimeframe: 7,
			filterHeatMap: false
		};

		componentDidMount() {
			this.renderMarkers();
		}

		componentDidUpdate(prevProps) {
			if (this.props.data.roomData !== prevProps.data.roomData)
				this.renderMarkers();
		}

		filterNearby = () => {
			this.setState(
				{
					filterNearby: !this.state.filterNearby
				},
				() => {
					this.renderMarkers();
				}
			);
		};

		filterRecent = () => {
			this.setState(
				{
					filterRecent: !this.state.filterRecent
				},
				() => {
					this.renderMarkers();
				}
			);
		};

		filterHeatmap = () => {
			this.setState({
				filterHeatMap: !this.state.filterHeatMap
			});
		};

		filterChangeNearby = (event, value) => {
			this.setState({ filterNearbyRadius: Number(value) }, () => {
				this.renderMarkers();
			});
		};

		filterChangeRecent = (event, value) => {
			this.setState({ filterRecentTimeframe: Number(value) }, () => {
				this.renderMarkers();
			});
		};

		filter = () => {
			let markers = this.props.data.roomData;
			if (this.state.filterNearby)
				markers = filterMetadataByDistance(
					markers,
					this.props.location,
					this.state.filterNearbyRadius
				);
			if (this.state.filterRecent)
				markers = filterMetadataByTime(
					markers,
					this.state.filterRecentTimeframe
				);
			return markers;
		};

		renderMarkers = () => {
			if (this.props.data && this.props.data.roomData) {
				const metadata = this.filter();
				this.setState({
					metadata: metadata,
					markersMetadata: metadata.map((element, index) => (
						<MarkerPlace
							key={element._id}
							element={element}
							index={index}
						/>
					))
				});
			}
		};

		renderFilter = () => {
			if (this.state.filterNearby || this.state.filterRecent)
				return (
					<MetadataFilter
						filterNearby={this.state.filterNearby}
						filterRecent={this.state.filterRecent}
						filterNearbyRadius={this.state.filterNearbyRadius}
						filterRecentTimeframe={this.state.filterRecentTimeframe}
						filterChangeNearby={this.filterChangeNearby}
						filterChangeRecent={this.filterChangeRecent}
					/>
				);
			else return null;
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

		handleMetadata = async (name, value, media) => {
			const response = await this.props.roomAddMetadataMedia(
				name,
				value,
				media,
				this.props.location.latitude,
				this.props.location.longitude
			);
			if (response && response.data && response.data.data)
				this.props.addMetadataIO(response.data.data);
		};

		render() {
			return (
				<WrappedComponent
					filter={this.renderFilter}
					filterNearby={this.filterNearby}
					filterRecent={this.filterRecent}
					filterHeatMap={this.filterHeatmap}
					filterNearbyManaged={this.state.filterNearby}
					filterRecentManaged={this.state.filterRecent}
					filterHeatMapManaged={this.state.filterHeatMap}
					metadata={this.state.metadata}
					markersMetadata={this.state.markersMetadata}
					roomAddMetadataInit={this.handleNewMetadataOpen}
					{...this.props}
				>
					<MetadataPlaces
						open={this.state.newMetadata}
						handleModalClose={this.handleNewMetadataClose}
						handleMetadata={this.handleMetadata}
					/>
				</WrappedComponent>
			);
		}
	}

	withMetadataPlaces.propTypes = {
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

	return withMetadataPlaces;
};

export default withMetadataPlaces;
