import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { CircleMarker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import format from "date-fns/format";

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
				<Card className={classes.root}>
					<CardHeader
						avatar={
							<Avatar className={classes.avatar}>
								{props.element.properties.author.substring(
									0,
									1
								)}
							</Avatar>
						}
						title={props.element.properties.author}
						subheader={format(
							new Date(props.element.properties.time),
							"MMMM iiii dd, yyyy"
						)}
					/>
					<CardContent style={{ color }}>
						<Typography color="inherit" variant="button">
							{text}
							<Badge
								color="primary"
								badgeContent={props.element.properties.value}
								className={classes.margin}
							/>
						</Typography>
						<Typography variant="body2" component="p">
							{props.element.properties.name}
						</Typography>
						<Typography variant="body2" component="p" gutterBottom>
							{props.element.properties.amenity}
						</Typography>
						<Typography
							variant="caption"
							color="textSecondary"
							component="p"
						>
							Latitude: {props.element.geometry.coordinates[0]}
						</Typography>
						<Typography
							variant="caption"
							color="textSecondary"
							component="p"
						>
							Longitude: {props.element.geometry.coordinates[1]}
						</Typography>
					</CardContent>
					<CardActions disableSpacing>
						<IconButton>
							<ShareIcon />
						</IconButton>
					</CardActions>
				</Card>
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
