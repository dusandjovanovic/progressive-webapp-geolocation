import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const metadataFilter = props => {
	const { classes } = props;

	return (
		<Grid
			container
			direction="column"
			justify="center"
			className={classes.root}
		>
			{props.filterNearby ? (
				<Grid container>
					<Grid item xs={12}>
						<Slider
							classes={{
								root: classes.inputsGroup
							}}
							color="primary"
							defaultValue={props.filterNearbyRadius}
							getAriaValueText={value => value}
							valueLabelDisplay="on"
							step={100}
							marks
							min={1}
							max={5000}
							onChange={props.filterChangeNearby}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography
							variant="caption"
							color="primary"
							className={classes.text}
						>
							Filter insights by <strong>radius (km)</strong>
						</Typography>
					</Grid>
				</Grid>
			) : null}

			{props.filterRecent ? (
				<Grid container>
					<Grid item xs={12}>
						<Slider
							classes={{
								root: classes.inputsGroup
							}}
							color="secondary"
							defaultValue={props.filterRecentTimeframe}
							getAriaValueText={value => value}
							valueLabelDisplay="on"
							step={1}
							marks
							min={1}
							max={30}
							onChange={props.filterChangeRecent}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography
							variant="caption"
							color="secondary"
							className={classes.text}
						>
							Filter insights by{" "}
							<strong>time added (days)</strong>
						</Typography>
					</Grid>
				</Grid>
			) : null}
		</Grid>
	);
};

metadataFilter.propTypes = {
	classes: PropTypes.object.isRequired,
	filterRecent: PropTypes.bool.isRequired,
	filterRecentTimeframe: PropTypes.number.isRequired,
	filterChangeRecent: PropTypes.func.isRequired,
	filterNearby: PropTypes.bool.isRequired,
	filterNearbyRadius: PropTypes.number.isRequired,
	filterChangeNearby: PropTypes.func.isRequired
};

export default withStyles(styles)(React.memo(metadataFilter));
