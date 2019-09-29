import React from "react";
import Typography from "@material-ui/core/Typography";
import NearMe from "@material-ui/icons/NearMe";
import MyLocation from "@material-ui/icons/MyLocation";
import { CircleMarker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const markerUser = props => {
	const { classes } = props;
	return (
		<CircleMarker
			center={[
				props.element.location.latitude,
				props.element.location.longitude
			]}
			radius={6}
			fillOpacity={props.current ? 0.75 : 0.5}
			stroke={props.current}
		>
			<Tooltip direction="bottom">
				<div className={classes.root}>
					<div className={classes.container}>
						{props.current ? (
							<MyLocation
								className={classes.icon}
								color="secondary"
							/>
						) : (
							<NearMe
								className={classes.icon}
								color="secondary"
							/>
						)}
						<Typography
							variant="h6"
							className={classes.text}
							color="secondary"
							component="p"
						>
							{props.element.username}
						</Typography>
					</div>
					{props.current ? (
						<Typography
							variant="caption"
							color="secondary"
							component="p"
							gutterBottom
						>
							This is your current location
						</Typography>
					) : null}
					<Typography variant="caption" component="p">
						Latitude: {props.element.location.latitude}
					</Typography>
					<Typography variant="caption" component="p">
						Longitude: {props.element.location.longitude}
					</Typography>
				</div>
			</Tooltip>
		</CircleMarker>
	);
};

markerUser.propTypes = {
	classes: PropTypes.object.isRequired,
	element: PropTypes.object.isRequired,
	current: PropTypes.bool.isRequired
};

export default withStyles(styles)(markerUser);
