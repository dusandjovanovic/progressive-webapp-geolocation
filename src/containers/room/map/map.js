import React from "react";
import Grid from "@material-ui/core/Grid";
import { Map, TileLayer } from "react-leaflet";
import PropTypes from "prop-types";

import "leaflet/dist/leaflet.css";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import { MAP_LAYER, MAP_ZOOM_LEVEL } from "../../../utils/constants";

class MapContainer extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<Grid container className={classes.root}>
				<Map
					style={{ height: "800px", width: "100%" }}
					zoom={MAP_ZOOM_LEVEL}
					center={[
						this.props.location.latitude,
						this.props.location.longitude
					]}
				>
					<TileLayer url={MAP_LAYER} />
					{this.props.markersMetadata}
					{this.props.markersUsers}
					{this.props.markerCurrentLocation}
				</Map>
			</Grid>
		);
	}
}

MapContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	markersUsers: PropTypes.arrayOf(PropTypes.object),
	markersMetadata: PropTypes.arrayOf(PropTypes.object),
	markerCurrentLocation: PropTypes.object
};

export default withStyles(styles)(MapContainer);
