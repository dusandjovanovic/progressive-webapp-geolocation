import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const RoomNew = props => (
	<Grid
		container
		spacing={2}
		direction="column"
		className={props.classes.root}
	>
		<Grid item xs={12}>
			<Grow in timeout={1000}>
				<Box mb={2}>
					<Typography
						variant="h4"
						color="secondary"
						className={props.classes.lightenedText}
					>
						Hello {props.username},
					</Typography>
					<Typography
						variant="h5"
						className={props.classes.lightenedText}
					>
						Join existing rooms to contribute with your insights.
					</Typography>
				</Box>
			</Grow>

			<Grid item xs={12}>
				<Grow in timeout={1250}>
					<Typography
						variant="h6"
						color="textSecondary"
						className={props.classes.lightenedText}
					>
						By joining a new room your location data is being shared
						and you are required to grant a persmission for that.
					</Typography>
				</Grow>
			</Grid>
		</Grid>
	</Grid>
);

RoomNew.propTypes = {
	classes: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired
};

export default withStyles(styles)(React.memo(RoomNew));
