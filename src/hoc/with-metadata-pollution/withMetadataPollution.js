import React from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

const withMetadataPollution = WrappedComponent => {
	class withMetadataPollution extends React.Component {
		state = {
			markersMetadata: null
		};

		componentDidMount() {
			this.renderMarkers();
		}

		componentDidUpdate(prevProps) {
			if (this.props.data.roomData !== prevProps.data.roomData) {
				this.renderMarkers();
			}
		}

		renderMarkers = () => {
			if (this.props.data && this.props.data.roomData) {
				this.setState({
					markersMedatata: this.props.data.roomData.map(element =>
						this.renderMarker(element)
					)
				});
			}
		};

		renderMarker = element => {
			return (
				<CircleMarker
					key={element._id}
					center={[
						element.geometry.coordinates.latitude,
						element.geometry.coordinates.longitude
					]}
					radius={20 * Math.log(element.properties.value / 100)}
					fillOpacity={0.5}
					stroke={false}
				>
					<Tooltip direction="bottom">
						<span>{element.properties.amenity}</span>
					</Tooltip>
				</CircleMarker>
			);
		};

		render() {
			return (
				<WrappedComponent
					markersMedatata={this.state.markersMedatata}
					{...this.props}
				/>
			);
		}
	}

	withMetadataPollution.propTypes = {
		username: PropTypes.string.isRequired,
		data: PropTypes.object.isRequired,
		room: PropTypes.object.isRequired
	};

	return withMetadataPollution;
};

export default withMetadataPollution;
