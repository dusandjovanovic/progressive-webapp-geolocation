import React from "react";

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
					{ enableHighAccuracy: true }
				);
				this.setState({
					locationWatcher: navigator.geolocation.watchPosition(
						this.handleLocationChange,
						this.handleLocationError,
						{ enableHighAccuracy: true }
					)
				});
			}
		}

		componentWillUnmount() {
			navigator.geolocation.clearWatch(this.state.locationWatcher);
		}

		handleLocationChange = position => {
			this.setState({
				location: {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				}
			});
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

	return withGeolocation;
};

export default withGeolocation;
