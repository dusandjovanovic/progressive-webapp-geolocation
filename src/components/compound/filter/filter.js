import React from "react";
import Typography from "@material-ui/core/es/Typography/Typography";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const filter = props => {
	const { classes } = props;

	return (
		<div className={classes.root}>
			<Typography variant="body1" className={classes.text}>
				<span className={classes.note}>Note: </span>
			</Typography>
		</div>
	);
};

filter.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(React.memo(filter));
