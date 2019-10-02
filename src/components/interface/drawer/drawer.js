import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import Chat from "@material-ui/icons/Chat";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const drawer = props => {
	const { classes } = props;

	return (
		<React.Fragment>
			<Tooltip title="Show messaging" className={classes.tooltip}>
				<IconButton
					color="inherit"
					onClick={props.handleDrawerOpen}
					className={!props.open ? classes.menuButton : classes.hide}
				>
					<Chat color="inherit" />
				</IconButton>
			</Tooltip>

			<Drawer
				className={classes.drawer}
				variant="persistent"
				open={props.open}
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={props.handleDrawerClose}>
						<ChevronLeft />
					</IconButton>
				</div>
				<Divider />
				<div className={classes.drawerContent}>{props.children}</div>
			</Drawer>
		</React.Fragment>
	);
};

drawer.propTypes = {
	classes: PropTypes.object.isRequired,
	open: PropTypes.bool.isRequired,
	handleDrawerOpen: PropTypes.func.isRequired,
	handleDrawerClose: PropTypes.func.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired
};

export default withStyles(styles)(React.memo(drawer));
