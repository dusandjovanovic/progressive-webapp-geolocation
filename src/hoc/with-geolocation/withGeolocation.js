import React from "react";
import PropTypes from "prop-types";

const LOCATION_OPTIONS = {
	enableHighAccuracy: true,
	timeout: 10000,
	maximumAge: 0
};

const withGeolocation = WrappedComponent => {
	class withGeolocation extends React.Component {
		state = {
			location: { latitude: 0.0, longitude: 0.0 },
			locationWatcher: null,
			locationError: null
		};

		componentDidMount() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					this.handleLocationChange,
					this.handleLocationError,
					LOCATION_OPTIONS
				);
				this.setState({
					locationWatcher: navigator.geolocation.watchPosition(
						this.handleLocationChange,
						this.handleLocationError,
						LOCATION_OPTIONS
					)
				});
			}
		}

		componentWillUnmount() {
			navigator.geolocation.clearWatch(this.state.locationWatcher);
		}

		handleLocationChange = async position => {
			this.setState(
				{
					location: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				},
				async () => {
					if (this.props.roomAddLocation) {
						let response = await this.props.roomAddLocation(
							this.state.location.latitude,
							this.state.location.longitude
						);
						this.props.addLocationChangeIO(
							response.data.delta.location
						);
					}
				}
			);
		};

		handleLocationError = error => {
			this.setState(
				{
					locationError: error
				},
				() => {
					alert(
						"Something went wrong and your location could not be determined."
					);
				}
			);
		};

		render() {
			return (
				<WrappedComponent
					location={this.state.location}
					{...this.props}
				/>
			);
		}
	}

	withGeolocation.propTypes = {
		username: PropTypes.string,
		data: PropTypes.object,
		room: PropTypes.object,
		roomGetData: PropTypes.func,
		roomLeaveExisting: PropTypes.func,
		roomPushMetadata: PropTypes.func,
		roomChangeMetadata: PropTypes.func,
		roomGetMetadata: PropTypes.func,
		roomAddNewUser: PropTypes.func,
		roomChangeUser: PropTypes.func,
		roomDeleteUser: PropTypes.func,
		userHistoryAdd: PropTypes.func,
		roomAddMessage: PropTypes.func,
		roomPushMessage: PropTypes.func,
		roomAddLocation: PropTypes.func,
		internalNotificationsAdd: PropTypes.func,
		io: PropTypes.func,
		initWebsocketIO: PropTypes.func,
		addMetadataIO: PropTypes.func,
		changeMetadataIO: PropTypes.func,
		addLocationChangeIO: PropTypes.func,
		joinRoomIO: PropTypes.func,
		leaveRoomIO: PropTypes.func,
		leaveRoomIOInit: PropTypes.func,
		socket: PropTypes.object,
		redirect: PropTypes.bool,
		location: PropTypes.object
	};

	return withGeolocation;
};

export default withGeolocation;
