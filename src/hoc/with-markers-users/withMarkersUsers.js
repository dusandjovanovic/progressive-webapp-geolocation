import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import NearMe from "@material-ui/icons/NearMe";
import MyLocation from "@material-ui/icons/MyLocation";
import { CircleMarker, Tooltip } from "react-leaflet";
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
						element.username !== this.props.username
							? this.renderGenericMarker(element)
							: null
					)
				});
			}
		};

		renderMarkerCurrentLocation = () => {
			if (this.props.data && this.props.data.users) {
				let markerCurrentLocation = null;
				forEach(this.props.data.users, element => {
					if (element.username === this.props.username) {
						markerCurrentLocation = this.renderGenericMarker(
							element
						);
					}
				});
				this.setState({ markerCurrentLocation: markerCurrentLocation });
			}
		};

		renderGenericMarker = element => {
			return (
				<CircleMarker
					key={element.username}
					center={[
						element.location.latitude,
						element.location.longitude
					]}
					radius={10}
					fillOpacity={
						element.username === this.props.username ? 0.75 : 0.5
					}
					stroke={element.username === this.props.username}
				>
					<Tooltip direction="bottom">
						<Grid container alignItems="center">
							{element.username === this.props.username ? (
								<MyLocation
									fontSize="small"
									color="secondary"
								/>
							) : (
								<NearMe fontSize="small" color="secondary" />
							)}
							<Typography
								variant="button"
								color="secondary"
								style={{ marginLeft: "0.25rem" }}
							>
								{element.username}
							</Typography>
						</Grid>
						<Grid container alignItems="center">
							{element.username === this.props.username ? (
								<Typography
									variant="caption"
									color="secondary"
									gutterBottom
								>
									This is your current location <br />
								</Typography>
							) : null}

							<Typography variant="caption">
								Latitude: {element.location.latitude} <br />
							</Typography>
							<Typography variant="caption">
								Longitude: {element.location.longitude} <br />
							</Typography>
						</Grid>
					</Tooltip>
				</CircleMarker>
			);
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
		data: PropTypes.object.isRequired,
		room: PropTypes.object.isRequired
	};

	return withMarkersUsers;
};

export default withMarkersUsers;
