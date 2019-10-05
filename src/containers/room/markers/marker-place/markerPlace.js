import React from "react";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import { Marker, Tooltip } from "react-leaflet";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import { roomUriMedia } from "../../../../utils/constantsAPI";

const markerPlaces = props => {
	const { classes } = props;

	const prettyDateFormat = time => {
		return new Date(time).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	const prettyAvatarHeadline = username => username.substring(0, 1);

	return (
		<Marker
			position={[
				props.element.geometry.coordinates[0],
				props.element.geometry.coordinates[1]
			]}
		>
			<Tooltip direction="bottom" className={classes.override}>
				<div className={classes.root}>
					<CardHeader
						avatar={
							<Avatar className={classes.avatar}>
								{prettyAvatarHeadline(
									props.element.properties.author
								)}
							</Avatar>
						}
						title={props.element.properties.author}
						subheader={prettyDateFormat(
							props.element.properties.time
						)}
					/>
					<CardMedia
						className={classes.media}
						image={roomUriMedia(props.element.properties.amenity)}
						title={props.element.properties.name}
					/>
					<CardContent>
						<Typography variant="body1" component="p">
							{props.element.properties.name}{" "}
							<Badge
								color="primary"
								badgeContent={props.element.properties.value}
								className={classes.margin}
							/>
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
				</div>
			</Tooltip>
		</Marker>
	);
};

markerPlaces.propTypes = {
	classes: PropTypes.object.isRequired,
	element: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired
};

export default withStyles(styles)(markerPlaces);
