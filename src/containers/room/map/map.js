import React from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import { Map, CircleMarker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

class MapContainer extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<Grid container className={classes.root}>
				<Map
					style={{ height: "620px", width: "100%" }}
					zoom={1}
					center={[-0.09, 51.505]}
				>
					<TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					<CircleMarker center={[51.505, -0.09]} />
				</Map>
			</Grid>
		);
	}
}

MapContainer.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapContainer);
