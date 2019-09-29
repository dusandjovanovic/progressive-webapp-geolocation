import React from "react";
import MarkerUser from "../../containers/room/markers/marker-user/markerUser";
import PropTypes from "prop-types";

import forEach from "lodash/forEach";

const withMarkersUsers = WrappedComponent => {
	class withMarkersUsers extends React.Component {
		state = {
			markersUsers: null,
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
				forEach(this.props.data.users, element => {
					if (element.username === this.props.username) {
						markerCurrentLocation = (
							<MarkerUser element={element} current />
						);
					}
				});
				this.setState({ markerCurrentLocation: markerCurrentLocation });
			}
		};

		render() {
			return (
				<WrappedComponent
					markersUsers={this.state.markersUsers}
					markerCurrentLocation={this.state.markerCurrentLocation}
					{...this.props}
				/>
			);
		}
	}

	withMarkersUsers.propTypes = {
		username: PropTypes.string.isRequired,
		data: PropTypes.object.isRequired
	};

	return withMarkersUsers;
};

export default withMarkersUsers;
