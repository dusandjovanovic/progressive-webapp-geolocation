import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "../../../components/interface/toolbar/toolbar";
import PropTypes from "prop-types";

import Add from "@material-ui/icons/Add";
import AccessTime from "@material-ui/icons/AccessTime";
import MyLocation from "@material-ui/icons/MyLocation";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class ToolbarContainer extends React.PureComponent {
	render() {
		const { classes } = this.props;

		return (
			<Toolbar>
				<Grid container justify="flex-end">
					<Button
						size="small"
						color="secondary"
						onClick={() => this.props.roomAddMetadataInit()}
					>
						<Add
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>{" "}
						Share location
					</Button>
					<Button size="small" color="secondary" onClick={null}>
						<MyLocation
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>{" "}
						Show nearby
					</Button>
					<Button size="small" color="secondary" onClick={null}>
						<AccessTime
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>{" "}
						Show recent
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={() => this.props.leaveRoomIOInit()}
					>
						Leave room
					</Button>
				</Grid>
			</Toolbar>
		);
	}
}

ToolbarContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	roomAddMetadataInit: PropTypes.func.isRequired,
	leaveRoomIOInit: PropTypes.func.isRequired
};

export default withStyles(styles)(ToolbarContainer);
