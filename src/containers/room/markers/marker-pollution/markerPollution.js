import React from "react";
import Typography from "@material-ui/core/Typography";
import { CircleMarker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

import NewReleases from "@material-ui/icons/NewReleases";

import classNames from "classnames";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import {
	IMPACT_COLORS,
	IMPACT_STRING_POLLUTION
} from "../../../../utils/constants";

const markerPollution = props => {
	const { classes } = props;
	const color = IMPACT_COLORS[props.element.properties.value - 1];
	const text = IMPACT_STRING_POLLUTION(props.element.properties.value);

	return (
		<CircleMarker
			center={[
				props.element.geometry.coordinates[0],
				props.element.geometry.coordinates[1]
			]}
			radius={12 + props.element.properties.value * 1.75}
			fillOpacity={0.5}
			stroke={false}
			color={color}
		>
			<Tooltip direction="bottom">
				<div className={classes.root}>
					<div
						className={classNames(
							classes.container,
							classes.marginBottom
						)}
						style={{ color }}
					>
						<NewReleases className={classes.icon} color="inherit" />
						<Typography variant="subtitle1" color="inherit">
							{text}
						</Typography>
					</div>
					<div className={classes.container}>
						<Typography variant="caption" gutterBottom>
							Shared by {props.element.properties.author}
						</Typography>
					</div>
					<div className={classes.container}>
						<Typography variant="caption">
							{props.element.properties.amenity}
						</Typography>
					</div>
				</div>
			</Tooltip>
		</CircleMarker>
	);
};

markerPollution.propTypes = {
	classes: PropTypes.object.isRequired,
	element: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
};

export default withStyles(styles)(markerPollution);
