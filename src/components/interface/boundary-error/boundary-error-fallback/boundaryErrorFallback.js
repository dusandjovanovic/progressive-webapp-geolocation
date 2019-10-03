import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

import Error from "../../../../assets/images/error.png";

const boundaryErrorFallback = props => {
	const { classes } = props;

	return (
		<Grid
			container
			direction="column"
			align="center"
			spacing={4}
			className={classes.root}
		>
			<Grid item xs={12}>
				<img className={classes.image} alt="error_img" src={Error} />
			</Grid>
			<Grid item xs={12}>
				<Typography variant="h5" gutterBottom>
					Something went wrong
				</Typography>
				<Typography variant="subtitle1" color="textSecondary">
					{props.code.toString()}
				</Typography>
			</Grid>
		</Grid>
	);
};

boundaryErrorFallback.propTypes = {
	classes: PropTypes.object.isRequired,
	code: PropTypes.object.isRequired
};

export default React.memo(withStyles(styles)(boundaryErrorFallback));
