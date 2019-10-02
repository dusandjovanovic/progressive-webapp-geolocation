import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "../../../components/interface/toolbar/toolbar";
import PropTypes from "prop-types";

import Navigation from "@material-ui/icons/Navigation";
import AccessTime from "@material-ui/icons/AccessTime";
import MyLocation from "@material-ui/icons/MyLocation";
import Layers from "@material-ui/icons/Layers";
import Close from "@material-ui/icons/Close";

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
						onClick={this.props.roomAddMetadataInit}
					>
						<Navigation
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>
						<Hidden smDown> Share location</Hidden>
					</Button>
					<Button
						size="small"
						color="secondary"
						onClick={this.props.filterNearby}
					>
						<MyLocation
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>
						<Hidden smDown> Show nearby</Hidden>
					</Button>
					<Button
						size="small"
						color="secondary"
						onClick={this.props.filterRecent}
					>
						<AccessTime
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>
						<Hidden smDown> Show recent</Hidden>
					</Button>
					<Button
						size="small"
						color="secondary"
						onClick={this.props.filterHeatMap}
					>
						<Layers
							fontSize="small"
							color="secondary"
							className={classes.icon}
						/>
						<Hidden smDown> Heat map</Hidden>
					</Button>
					<Button
						size="small"
						color="primary"
						onClick={this.props.leaveRoomIOInit}
					>
						<Close
							fontSize="small"
							color="primary"
							className={classes.icon}
						/>
						<Hidden smDown> Leave room</Hidden>
					</Button>
				</Grid>
			</Toolbar>
		);
	}
}

ToolbarContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	roomAddMetadataInit: PropTypes.func.isRequired,
	leaveRoomIOInit: PropTypes.func.isRequired,
	filterNearby: PropTypes.func.isRequired,
	filterRecent: PropTypes.func.isRequired,
	filterHeatMap: PropTypes.func.isRequired
};

export default withStyles(styles)(ToolbarContainer);
