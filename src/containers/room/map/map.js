import React from "react";
import { Map, TileLayer, LayersControl, LayerGroup } from "react-leaflet";
import HeatmapLayer from "./layers/heatMapLayer";
import PropTypes from "prop-types";

import withMapElements from "../../../hoc/with-map-elements/withMapElements";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import { MAP_LAYER, MAP_ZOOM_LEVEL } from "../../../utils/constants";

class MapContainer extends React.Component {
	render() {
		const { classes } = this.props;
		return (
			<React.Fragment>
				{this.props.filter()}
				<Map
					ref={this.props.forwardedRef}
					className={classes.root}
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
								map={this.props.map}
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
			</React.Fragment>
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
	heatMap: PropTypes.bool,
	filter: PropTypes.func.isRequired,
	map: PropTypes.object.isRequired,
	mapRebase: PropTypes.func.isRequired,
	forwardedRef: PropTypes.object.isRequired
};

export default withMapElements(withStyles(styles)(MapContainer));
