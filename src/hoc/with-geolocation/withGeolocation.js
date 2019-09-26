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

		handleLocationChange = position => {
			console.log(position);
			this.setState(
				{
					location: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				},
				() => {
					if (this.props.room && this.props.room.name) {
						this.props.roomChangeUser({
							username: this.props.username,
							location: this.state.location
						});
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
					alert(this.state.locationError);
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
		internalNotificationsAdd: PropTypes.func
	};

	return withGeolocation;
};

export default withGeolocation;
