import React from "react";
import Grid from "@material-ui/core/Grid";
import Map from "./map/map";
import Messaging from "./messaging/messaging";
import Toolbar from "./toolbar/toolbar";
import Statusbar from "./statusbar/statusbar";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import withIO from "../../hoc/with-io/withIO";
import withGeolocation from "../../hoc/with-geolocation/withGeolocation";
import withMarkersUsers from "../../hoc/with-markers-users/withMarkersUsers";
import withErrorHandler from "../../hoc/with-error-handler/withErrorHandler";

import {
	roomGetData,
	roomLeaveExisting,
	roomPushMetadata,
	roomChangeMetadata,
	roomGetMetadata,
	roomAddNewUser,
	roomChangeUser,
	roomDeleteUser,
	userHistoryAdd,
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
		}
	};

	componentWillUnmount() {
		if (this.props.room.name) this.props.leaveRoomIOInit();
	}

	render() {
		const { classes } = this.props;

		return (
			<Grid container className={classes.root} direction="column">
				{this.props.redirect ? <Redirect to="/" /> : null}
				<Grid container>
					<Toolbar
						disabled={this.props.graphManaged}
						leaveRoomIOInit={this.props.leaveRoomIOInit}
					/>
				</Grid>
				<Grid container>
					<Grid item xs={3}>
						<Messaging
							room={this.props.room.name || ""}
							username={this.props.username}
							io={this.props.io}
						/>
					</Grid>
					<Grid item xs={9} className={classes.whiteboard}>
						<Map
							location={this.props.location}
							markersUsers={this.props.markersUsers}
							markerCurrentLocation={
								this.props.markerCurrentLocation
							}
						/>
					</Grid>
					<Statusbar
						users={this.props.data.users || []}
						master={this.props.room.master || false}
						graphManaged={this.props.graphManaged}
						graphOperation={this.props.graphOperation}
						createdBy={
							this.props.data.createdBy || "Exiting room.."
						}
					/>
				</Grid>
			</Grid>
		);
	}
}

Room.propTypes = {
	classes: PropTypes.object.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	]).isRequired,
	username: PropTypes.string.isRequired,
	data: PropTypes.object.isRequired,
	room: PropTypes.object.isRequired,
	error: PropTypes.string,
	location: PropTypes.object.isRequired,
	markersUsers: PropTypes.object,
	markerCurrentLocation: PropTypes.object,
	roomGetData: PropTypes.func.isRequired,
	roomLeaveExisting: PropTypes.func.isRequired,
	roomPushMetadata: PropTypes.func.isRequired,
	roomChangeMetadata: PropTypes.func.isRequired,
	roomGetMetadata: PropTypes.func.isRequired,
	roomAddNewUser: PropTypes.func.isRequired,
	roomChangeUser: PropTypes.func.isRequired,
	roomDeleteUser: PropTypes.func.isRequired,
	userHistoryAdd: PropTypes.func.isRequired,
	internalNotificationsAdd: PropTypes.func.isRequired
};

const mapStateToProps = state => {
	return {
		username: state.auth.username,
		data: state.room.data,
		room: state.room.room,
		error: state.room.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		roomGetData: name => dispatch(roomGetData(name)),
		roomLeaveExisting: roomDeleted =>
			dispatch(roomLeaveExisting(roomDeleted)),
		roomPushMetadata: metadataItem =>
			dispatch(roomPushMetadata(metadataItem)),
		roomChangeMetadata: metadata => dispatch(roomChangeMetadata(metadata)),
		roomGetMetadata: () => dispatch(roomGetMetadata()),
		roomAddNewUser: user => dispatch(roomAddNewUser(user)),
		roomChangeUser: user => dispatch(roomChangeUser(user)),
		roomDeleteUser: username => dispatch(roomDeleteUser(username)),
		userHistoryAdd: score => dispatch(userHistoryAdd(score)),
		internalNotificationsAdd: (message, variant) =>
			dispatch(internalNotificationsAdd(message, variant))
	};
};

export const RoomPlaces = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withGeolocation(
		withMarkersUsers(withIO(withStyles(styles)(withErrorHandler(Room))))
	)
);

export const RoomPolution = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withGeolocation(
		withMarkersUsers(withIO(withStyles(styles)(withErrorHandler(Room))))
	)
);
