import React from "react";
import MarkerUser from "../../containers/room/markers/marker-user/markerUser";
import PropTypes from "prop-types";

import forEach from "lodash/forEach";

const withUsers = WrappedComponent => {
	class withUsers extends React.Component {
		state = {
			users: [],
			markersUsers: null,
			currentLocation: null,
			markerCurrentLocation: null
		};

		componentDidMount() {
			this.renderMarkersUsers();
			this.renderMarkerCurrentLocation();
		}

		componentDidUpdate(prevProps) {
			if (this.props.data.users !== prevProps.data.users) {
				this.renderMarkersUsers();
				this.renderMarkerCurrentLocation();
			}
		}

		renderMarkersUsers = () => {
			if (this.props.data && this.props.data.users) {
				this.setState({
					users: this.props.data.users,
					markersUsers: this.props.data.users.map(element =>
						element.username !== this.props.username ? (
							<MarkerUser
								key={element.username}
								element={element}
								current={false}
							/>
						) : null
					)
				});
			}
		};

		renderMarkerCurrentLocation = () => {
			if (this.props.data && this.props.data.users) {
				let markerCurrentLocation = null;
				let currentLocation = null;
				forEach(this.props.data.users, element => {
					if (element.username === this.props.username) {
						currentLocation = element;
						markerCurrentLocation = (
							<MarkerUser element={element} current />
						);
					}
				});
				this.setState({
					currentLocation: currentLocation,
					markerCurrentLocation: markerCurrentLocation
				});
			}
		};

		render() {
			return (
				<WrappedComponent
					users={this.state.users}
					markersUsers={this.state.markersUsers}
					currentLocation={this.state.currentLocation}
					markerCurrentLocation={this.state.markerCurrentLocation}
					{...this.props}
				/>
			);
		}
	}

	withUsers.propTypes = {
		username: PropTypes.string.isRequired,
		data: PropTypes.object.isRequired
	};

	return withUsers;
};

export default withUsers;
