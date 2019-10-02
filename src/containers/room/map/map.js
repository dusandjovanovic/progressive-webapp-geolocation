import React from "react";
import Grid from "@material-ui/core/Grid";
import { Map, TileLayer, LayersControl, LayerGroup } from "react-leaflet";
import HeatmapLayer from "./layers/heatMapLayer";
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
					style={{ height: "calc(100vh - 152px)", width: "100%" }}
					zoom={MAP_ZOOM_LEVEL}
					zoomControl={false}
					attributionControl={false}
					layerToggleControl={false}
					center={[
						this.props.location.latitude,
						this.props.location.longitude
					]}
				>
					<LayersControl position="bottomright">
						<LayersControl.BaseLayer name="BaseLayer" checked>
							<TileLayer url={MAP_LAYER} />
						</LayersControl.BaseLayer>
						<LayersControl.Overlay
							name="MetadataLayer"
							checked={!this.props.heatMap}
						>
							<LayerGroup>
								{this.props.markersMetadata}
							</LayerGroup>
						</LayersControl.Overlay>
						<LayersControl.Overlay
							name="UserLocationsLayer"
							checked={!this.props.heatMap}
						>
							<LayerGroup>
								{this.props.markersUsers}
								{this.props.markerCurrentLocation}
							</LayerGroup>
						</LayersControl.Overlay>
						<LayersControl.Overlay
							name="HeatmapLayer"
							checked={this.props.heatMap}
						>
							<HeatmapLayer
								points={this.props.metadata}
								longitudeExtractor={element =>
									element.geometry.coordinates[1]
								}
								latitudeExtractor={element =>
									element.geometry.coordinates[0]
								}
								intensityExtractor={element =>
									parseFloat(element.properties.value)
								}
							/>
						</LayersControl.Overlay>
					</LayersControl>
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
	metadata: PropTypes.arrayOf(PropTypes.object),
	markerCurrentLocation: PropTypes.object,
	heatMap: PropTypes.bool
};

export default withStyles(styles)(MapContainer);
