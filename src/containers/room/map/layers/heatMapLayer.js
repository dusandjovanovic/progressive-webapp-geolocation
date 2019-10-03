import React from "react";
import map from "lodash/map";
import reduce from "lodash/reduce";
import filter from "lodash/filter";
import isNumber from "lodash/isNumber";
import { MapLayer, withLeaflet } from "react-leaflet";
import simpleheat from "simpleheat";

function isInvalid(num) {
	return !isNumber(num) && !num;
}

function isValid(num) {
	return !isInvalid(num);
}

function isValidLatLngArray(arr) {
	return filter(arr, isValid).length === arr.length;
}

function isInvalidLatLngArray(arr) {
	return !isValidLatLngArray(arr);
}

function safeRemoveLayer(leafletMap, el) {
	const { overlayPane } = leafletMap.getPanes();
	if (overlayPane && overlayPane.contains(el)) {
		overlayPane.removeChild(el);
	}
}

export default withLeaflet(
	class HeatmapLayer extends MapLayer {
		createLeafletElement() {
			return null;
		}

		componentDidMount() {
			const canAnimate =
				this.props.leaflet.map.options.zoomAnimation &&
				this.props.map.Browser.any3d;
			const zoomClass = `leaflet-zoom-${
				canAnimate ? "animated" : "hide"
			}`;
			const mapSize = this.props.leaflet.map.getSize();
			const transformProp = this.props.map.DomUtil.testProp([
				"transformOrigin",
				"WebkitTransformOrigin",
				"msTransformOrigin"
			]);

			this._el = this.props.map.DomUtil.create("canvas", zoomClass);
			this._el.style[transformProp] = "50% 50%";
			this._el.width = mapSize.x;
			this._el.height = mapSize.y;

			const el = this._el;

			const Heatmap = this.props.map.Layer.extend({
				onAdd: leafletMap =>
					leafletMap.getPanes().overlayPane.appendChild(el),
				addTo: leafletMap => {
					leafletMap.addLayer(this);
					return this;
				},
				onRemove: leafletMap => safeRemoveLayer(leafletMap, el)
			});

			this.leafletElement = new Heatmap();
			super.componentDidMount();
			this._heatmap = simpleheat(this._el);
			this.reset();

			this.attachEvents();
			this.updateHeatmapProps(this.getHeatmapProps(this.props));
		}

		componentDidUpdate(prevProps) {
			this.props.leaflet.map.invalidateSize();
			this.reset();

			const currentProps = prevProps;
			const nextHeatmapProps = this.getHeatmapProps(this.props);

			this.updateHeatmapGradient(nextHeatmapProps.gradient);

			const hasRadiusUpdated =
				nextHeatmapProps.radius !== currentProps.radius;
			const hasBlurUpdated = nextHeatmapProps.blur !== currentProps.blur;

			if (hasRadiusUpdated || hasBlurUpdated) {
				this.updateHeatmapRadius(
					nextHeatmapProps.radius,
					nextHeatmapProps.blur
				);
			}

			if (nextHeatmapProps.max !== currentProps.max) {
				this.updateHeatmapMax(nextHeatmapProps.max);
			}
		}

		componentWillUnmount() {
			safeRemoveLayer(this.props.leaflet.map, this._el);
			const leafletMap = this.props.leaflet.map;
			leafletMap.on("viewreset", null);
			leafletMap.on("moveend", null);
		}

		getMax(props) {
			return props.max || 3.0;
		}

		getRadius(props) {
			return props.radius || 30;
		}

		getMaxZoom(props) {
			return props.maxZoom || 18;
		}

		getMinOpacity(props) {
			return props.minOpacity || 0.01;
		}

		getBlur(props) {
			return props.blur || 15;
		}

		getHeatmapProps(props) {
			return {
				minOpacity: this.getMinOpacity(props),
				maxZoom: this.getMaxZoom(props),
				radius: this.getRadius(props),
				blur: this.getBlur(props),
				max: this.getMax(props),
				gradient: props.gradient
			};
		}

		updateHeatmapProps(props) {
			this.updateHeatmapRadius(props.radius, props.blur);
			this.updateHeatmapGradient(props.gradient);
			this.updateHeatmapMax(props.max);
		}

		updateHeatmapRadius(radius, blur) {
			if (radius) {
				this._heatmap.radius(radius, blur);
			}
		}

		updateHeatmapGradient(gradient) {
			if (gradient) {
				this._heatmap.gradient(gradient);
			}
		}

		updateHeatmapMax(maximum) {
			if (maximum) {
				this._heatmap.max(maximum);
			}
		}

		attachEvents() {
			const leafletMap = this.props.leaflet.map;
			leafletMap.on("viewreset", () => this.reset());
			leafletMap.on("moveend", () => this.reset());
			if (
				leafletMap.options.zoomAnimation &&
				this.props.map.Browser.any3d
			) {
				leafletMap.on("zoomanim", this._animateZoom, this);
			}
		}

		_animateZoom(e) {
			const scale = this.props.leaflet.map.getZoomScale(e.zoom);
			const offset = this.props.leaflet.map
				._getCenterOffset(e.center)
				._multiplyBy(-scale)
				.subtract(this.props.leaflet.map._getMapPanePos());

			if (this.props.map.DomUtil.setTransform) {
				this.props.map.DomUtil.setTransform(this._el, offset, scale);
			} else {
				this._el.style[
					this.props.map.DomUtil.TRANSFORM
				] = `${this.props.map.DomUtil.getTranslateString(
					offset
				)} scale(${scale})`;
			}
		}

		reset() {
			try {
				const topLeft = this.props.leaflet.map.containerPointToLayerPoint(
					[0, 0]
				);
				this.props.map.DomUtil.setPosition(this._el, topLeft);

				const size = this.props.leaflet.map.getSize();

				if (this._heatmap._width !== size.x) {
					this._el.width = this._heatmap._width = size.x;
				}
				if (this._heatmap._height !== size.y) {
					this._el.height = this._heatmap._height = size.y;
				}

				if (
					this._heatmap &&
					!this._frame &&
					!this.props.leaflet.map._animating
				) {
					this._frame = this.props.map.Util.requestAnimFrame(
						this.redraw,
						this
					);
				}

				this.redraw();
			} catch (error) {
				return null;
			}
		}

		redraw() {
			try {
				const r = this._heatmap._r;
				const size = this.props.leaflet.map.getSize();
				if (size === 0) return null;

				const maxIntensity =
					this.props.max === undefined ? 1 : this.getMax(this.props);

				const maxZoom =
					this.props.maxZoom === undefined
						? this.props.leaflet.map.getMaxZoom()
						: this.getMaxZoom(this.props);

				const v =
					1 /
					Math.pow(
						2,
						Math.max(
							0,
							Math.min(
								maxZoom - this.props.leaflet.map.getZoom(),
								12
							)
						) / 2
					);

				const cellSize = r / 2;
				const panePos = this.props.leaflet.map._getMapPanePos();
				const offsetX = panePos.x % cellSize;
				const offsetY = panePos.y % cellSize;
				const getLat = this.props.latitudeExtractor;
				const getLng = this.props.longitudeExtractor;
				const getIntensity = this.props.intensityExtractor;

				const inBounds = (p, bounds) => bounds.contains(p);

				const filterUndefined = row =>
					filter(row, c => c !== undefined);

				const roundResults = results =>
					reduce(
						results,
						(result, row) =>
							map(filterUndefined(row), cell => [
								Math.round(cell[0]),
								Math.round(cell[1]),
								Math.min(cell[2], maxIntensity),
								cell[3]
							]).concat(result),
						[]
					);

				const accumulateInGrid = (points, leafletMap, bounds) =>
					reduce(
						points,
						(grid, point) => {
							const latLng = [getLat(point), getLng(point)];
							if (isInvalidLatLngArray(latLng)) {
								return grid;
							}

							const p = leafletMap.latLngToContainerPoint(latLng);

							if (!inBounds(p, bounds)) {
								return grid;
							}

							const x =
								Math.floor((p.x - offsetX) / cellSize) + 2;
							const y =
								Math.floor((p.y - offsetY) / cellSize) + 2;

							grid[y] = grid[y] || [];
							const cell = grid[y][x];

							const alt = getIntensity(point) * 10;
							const k = alt * v;

							if (!cell) {
								grid[y][x] = [p.x, p.y, k, 1];
							} else {
								cell[0] =
									(cell[0] * cell[2] + p.x * k) /
									(cell[2] + k);
								cell[1] =
									(cell[1] * cell[2] + p.y * k) /
									(cell[2] + k);
								cell[2] += k;
								cell[3] += 1;
							}

							return grid;
						},
						[]
					);

				const getBounds = () =>
					new this.props.map.Bounds(
						this.props.map.point([-r, -r]),
						size.add([r, r])
					);

				const getDataForHeatmap = (points, leafletMap) =>
					roundResults(
						accumulateInGrid(
							points,
							leafletMap,
							getBounds(leafletMap)
						)
					);

				const data = getDataForHeatmap(
					this.props.points,
					this.props.leaflet.map
				);

				this._heatmap.clear();
				this._heatmap.data(data).draw(this.getMinOpacity(this.props));

				this._frame = null;

				if (
					this.props.onStatsUpdate &&
					this.props.points &&
					this.props.points.length > 0
				) {
					this.props.onStatsUpdate(
						reduce(
							data,
							(stats, point) => {
								stats.max =
									point[3] > stats.max ? point[3] : stats.max;
								stats.min =
									point[3] < stats.min ? point[3] : stats.min;
								return stats;
							},
							{ min: Infinity, max: -Infinity }
						)
					);
				}
			} catch (error) {
				return null;
			}
		}

		render(): React.Element {
			return null;
		}
	}
);
