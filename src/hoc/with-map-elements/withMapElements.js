import React from "react";
import leaflet from "leaflet";
import PropTypes from "prop-types";

import map from "lodash/map";
import min from "lodash/min";
import max from "lodash/max";
import isNumber from "lodash/isNumber";

import "leaflet/dist/leaflet.css";

delete leaflet.Icon.Default.prototype._getIconUrl;

leaflet.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const withMapElements = WrappedComponent => {
	class withMapElements extends React.Component {
		constructor(props) {
			super(props);
			this.forwardedRef = React.createRef();
		}

		mapRebase = () => {
			const points = this.props.metadata;
			const lats = map(
				points,
				element => element.geometry.coordinates[0]
			);
			const lngs = map(
				points,
				element => element.geometry.coordinates[1]
			);
			const ne = { lng: max(lngs), lat: max(lats) };
			const sw = { lng: min(lngs), lat: min(lats) };

			if (
				this.shouldIgnoreLocation(ne) ||
				this.shouldIgnoreLocation(sw)
			) {
				return;
			}

			this.forwardedRef.current.fitBounds(
				leaflet.latLngBounds(leaflet.latLng(sw), leaflet.latLng(ne))
			);
		};

		shouldIgnoreLocation = loc => {
			return this.isInvalid(loc.lng) || this.isInvalid(loc.lat);
		};

		isInvalid = num => {
			return !isNumber(num) && !num;
		};

		render() {
			return (
				<WrappedComponent
					map={leaflet}
					mapRebase={this.mapRebase}
					forwardedRef={this.forwardedRef}
					{...this.props}
				/>
			);
		}
	}

	withMapElements.propTypes = {
		metadata: PropTypes.arrayOf(PropTypes.object).isRequired
	};

	return withMapElements;
};

export default withMapElements;
