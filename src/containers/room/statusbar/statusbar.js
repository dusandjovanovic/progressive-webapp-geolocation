import React from "react";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import NearMe from "@material-ui/icons/NearMe";
import Timelapse from "@material-ui/icons/Timelapse";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import classNames from "classnames";

const statusbar = props => {
	const { classes } = props;
	return (
		<footer className={classes.root}>
			<Typography
				variant="caption"
				className={classNames(classes.element, classes.elementLight)}
			>
				Everyone in the room:
			</Typography>
			{props.users.map(user => (
				<Typography
					variant="caption"
					className={classNames(
						classes.element,
						classes.elementLight
					)}
					key={user.username}
				>
					{user.username}
				</Typography>
			))}
			{props.filterHeatMapManaged ? (
				<div className={classes.managed}>
					<Chip
						size="small"
						label={"Heat map"}
						className={classes.elementManaged}
					/>
				</div>
			) : null}
			{props.filterRecentManaged ? (
				<div className={classes.managed}>
					<Chip
						color="secondary"
						size="small"
						label={"Insights recently"}
						deleteIcon={<Timelapse />}
						onDelete={() => {}}
						className={classes.elementManaged}
					/>
				</div>
			) : null}
			{props.filterNearbyManaged ? (
				<div className={classes.managed}>
					<Chip
						color="secondary"
						size="small"
						label={"Insights near me"}
						deleteIcon={<NearMe />}
						onDelete={() => {}}
						className={classes.elementManaged}
					/>
				</div>
			) : null}
		</footer>
	);
};

statusbar.propTypes = {
	classes: PropTypes.object.isRequired,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	filterNearbyManaged: PropTypes.bool.isRequired,
	filterRecentManaged: PropTypes.bool.isRequired,
	filterHeatMapManaged: PropTypes.bool.isRequired
};

export default withStyles(styles)(React.memo(statusbar));
