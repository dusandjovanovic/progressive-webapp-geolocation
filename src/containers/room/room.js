import React from "react";
import Grid from "@material-ui/core/Grid";
import Map from "./map/map";
import Messaging from "./messaging/messaging";
import Toolbar from "./toolbar/toolbar";
import Statusbar from "./statusbar/statusbar";
import Drawer from "../../components/interface/drawer/drawer";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import withIO from "../../hoc/with-io/withIO";
import withGeolocation from "../../hoc/with-geolocation/withGeolocation";
import withUsers from "../../hoc/with-users/withUsers";
import withErrorHandler from "../../hoc/with-error-handler/withErrorHandler";
import withMetadataPollution from "../../hoc/with-metadata-pollution/withMetadataPollution";
import withMetadataPlaces from "../../hoc/with-metadata-places/withMetadataPlaces";
import withMetadataTraffic from "../../hoc/with-metadata-traffic/withMetadataTraffic";

import {
	roomGetData,
	roomLeaveExisting,
	roomPushMetadata,
	roomChangeMetadata,
	roomAddMetadata,
	roomGetMetadata,
	roomAddNewUser,
	roomChangeUser,
	roomDeleteUser,
	userHistoryAdd,
	roomAddMessage,
	roomPushMessage,
	internalNotificationsAdd
} from "../../store/actions/index";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class Room extends React.Component {
	state = {
		error: {
			hasError: false,
			name: null,
			description: null
		},
		drawer: window.innerWidth > 600
	};

	componentWillUnmount() {
		if (this.props.data.name) this.props.leaveRoomIOInit();
	}

	handleDrawerOpen = () => {
		this.setState({ drawer: true });
	};

	handleDrawerClose = () => {
		this.setState({ drawer: false });
	};

	render() {
		const { classes } = this.props;

		return (
			<Grid container className={classes.root} direction="column">
				{this.props.redirect ? <Redirect to="/" /> : null}
				{this.props.children}
				<Toolbar
					filterNearby={this.props.filterNearby}
					filterRecent={this.props.filterRecent}
					filterHeatMap={this.props.filterHeatMap}
					roomAddMetadataInit={this.props.roomAddMetadataInit}
					leaveRoomIOInit={this.props.leaveRoomIOInit}
				/>
				<Grid container>
					<Grid
						item
						xs={12}
						className={
							this.state.drawer
								? `${classes.base} ${classes.content} ${classes.contentShift}`
								: `${classes.base}`
						}
					>
						<Drawer
							open={this.state.drawer}
							handleDrawerOpen={this.handleDrawerOpen}
							handleDrawerClose={this.handleDrawerClose}
						>
							<Messaging
								room={this.props.data.name || ""}
								username={this.props.username}
								messages={this.props.data.roomMessages}
								roomAddMessage={this.props.roomAddMessage}
								roomPushMessage={this.props.roomPushMessage}
								io={this.props.io}
							/>
						</Drawer>
						<Map
							location={this.props.location}
							markersUsers={this.props.markersUsers}
							markerCurrentLocation={
								this.props.markerCurrentLocation
							}
							markersMetadata={this.props.markersMetadata}
							metadata={this.props.metadata}
							heatMap={this.props.filterHeatMapManaged}
						/>
					</Grid>
					<Statusbar
						users={this.props.data.users || []}
						filterNearbyManaged={this.props.filterNearbyManaged}
						filterRecentManaged={this.props.filterRecentManaged}
						filterHeatMapManaged={this.props.filterHeatMapManaged}
					/>
				</Grid>
			</Grid>
		);
	}
}

Room.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired,
	classes: PropTypes.object.isRequired,
	username: PropTypes.string,
	data: PropTypes.object,
	roomGetData: PropTypes.func.isRequired,
	roomLeaveExisting: PropTypes.func.isRequired,
	roomPushMetadata: PropTypes.func.isRequired,
	roomChangeMetadata: PropTypes.func.isRequired,
	roomAddMetadata: PropTypes.func.isRequired,
	roomGetMetadata: PropTypes.func.isRequired,
	roomAddNewUser: PropTypes.func.isRequired,
	roomChangeUser: PropTypes.func.isRequired,
	roomDeleteUser: PropTypes.func.isRequired,
	userHistoryAdd: PropTypes.func.isRequired,
	roomAddMessage: PropTypes.func.isRequired,
	roomPushMessage: PropTypes.func.isRequired,
	internalNotificationsAdd: PropTypes.func.isRequired,
	io: PropTypes.func.isRequired,
	initWebsocketIO: PropTypes.func.isRequired,
	addMetadataIO: PropTypes.func.isRequired,
	changeMetadataIO: PropTypes.func.isRequired,
	joinRoomIO: PropTypes.func.isRequired,
	leaveRoomIO: PropTypes.func.isRequired,
	leaveRoomIOInit: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	redirect: PropTypes.bool.isRequired,
	location: PropTypes.object.isRequired,
	markersUsers: PropTypes.arrayOf(PropTypes.object),
	markersMetadata: PropTypes.arrayOf(PropTypes.object),
	metadata: PropTypes.arrayOf(PropTypes.object),
	markerCurrentLocation: PropTypes.object,
	roomAddMetadataInit: PropTypes.func.isRequired,
	filterNearby: PropTypes.func.isRequired,
	filterRecent: PropTypes.func.isRequired,
	filterHeatMap: PropTypes.func.isRequired,
	filterNearbyManaged: PropTypes.bool.isRequired,
	filterRecentManaged: PropTypes.bool.isRequired,
	filterHeatMapManaged: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
	return {
		username: state.auth.username,
		data: state.room.data,
		error: state.room.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		roomGetData: id => dispatch(roomGetData(id)),
		roomLeaveExisting: roomDeleted =>
			dispatch(roomLeaveExisting(roomDeleted)),
		roomPushMetadata: (metaobject, pushNotification) =>
			dispatch(roomPushMetadata(metaobject, pushNotification)),
		roomChangeMetadata: metadata => dispatch(roomChangeMetadata(metadata)),
		roomAddMetadata: (name, value, amenity, latitude, longitude) =>
			dispatch(
				roomAddMetadata(name, value, amenity, latitude, longitude)
			),
		roomGetMetadata: () => dispatch(roomGetMetadata()),
		roomAddNewUser: user => dispatch(roomAddNewUser(user)),
		roomChangeUser: user => dispatch(roomChangeUser(user)),
		roomDeleteUser: username => dispatch(roomDeleteUser(username)),
		userHistoryAdd: score => dispatch(userHistoryAdd(score)),
		roomAddMessage: message => dispatch(roomAddMessage(message)),
		roomPushMessage: message => dispatch(roomPushMessage(message)),
		internalNotificationsAdd: (message, variant) =>
			dispatch(internalNotificationsAdd(message, variant))
	};
};

export const RoomPlaces = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withIO(
		withGeolocation(
			withMetadataPlaces(
				withUsers(withStyles(styles)(withErrorHandler(Room)))
			)
		)
	)
);

export const RoomPollution = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withIO(
		withGeolocation(
			withMetadataPollution(
				withUsers(withStyles(styles)(withErrorHandler(Room)))
			)
		)
	)
);

export const RoomTraffic = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withIO(
		withGeolocation(
			withMetadataTraffic(
				withUsers(withStyles(styles)(withErrorHandler(Room)))
			)
		)
	)
);
