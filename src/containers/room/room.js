import React from "react";
import Grid from "@material-ui/core/Grid";
import Map from "./map/map";
import Messaging from "./messaging/messaging";
import Statusbar from "./statusbar/statusbar";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import withAlgorithm from "../../hoc/with-algorithm/withAlgorithm";
import withPlayground from "../../hoc/with-playground/withPlayground";
import withGraph from "../../hoc/with-graph/withGraph";
import withIO from "../../hoc/with-io/withIO";
import withCompete from "../../hoc/with-compete/withCompete";
import withLearn from "../../hoc/with-learn/withLearn";
import withErrorHandler from "../../hoc/with-error-handler/withErrorHandler";

import {
	roomLeaveExisting,
	roomDeleteExisting,
	roomGetGraph,
	roomChangeGraph,
	roomGetTraversal,
	roomChangeTraversal,
	roomGetData,
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
				<Grid container>{this.props.children}</Grid>
				<Grid container>
					<Grid item xs={3}>
						<Messaging
							room={this.props.room.name || ""}
							username={this.props.username}
							io={this.props.io}
						/>
					</Grid>
					<Grid item xs={9} className={classes.whiteboard}>
						<Map />
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
	redirect: PropTypes.bool.isRequired,
	addEdge: PropTypes.func,
	addEdgeIO: PropTypes.func,
	addGraphIO: PropTypes.func,
	addNode: PropTypes.func,
	initWebsocketIO: PropTypes.func,
	addNodeIO: PropTypes.func,
	addReceivedEdge: PropTypes.func,
	addReceivedNode: PropTypes.func,
	algorithm: PropTypes.bool,
	algorithmActive: PropTypes.bool,
	algorithmBegin: PropTypes.func,
	algorithmBeginIO: PropTypes.func,
	algorithmCanceled: PropTypes.func,
	algorithmEndedIO: PropTypes.func,
	algorithmNextState: PropTypes.func,
	algorithmPause: PropTypes.func,
	algorithmPreviousState: PropTypes.func,
	algorithmState: PropTypes.object,
	algorithmType: PropTypes.string,
	algorithmVisualization: PropTypes.object,
	algorithmVisualize: PropTypes.func,
	changeGraphIO: PropTypes.func,
	competitive: PropTypes.bool,
	competeBeginIO: PropTypes.func,
	competeEndedIO: PropTypes.func,
	data: PropTypes.object,
	deleteRoomIO: PropTypes.func,
	deleteRoomIOInit: PropTypes.func,
	error: PropTypes.string,
	getGraphIO: PropTypes.func,
	graph: PropTypes.object,
	graphAnimated: PropTypes.bool,
	graphAnimatedEnded: PropTypes.func,
	graphManaged: PropTypes.bool,
	graphManagedAddEdge: PropTypes.func,
	graphManagedAlgorithm: PropTypes.func,
	graphManagedAlgorithmEnded: PropTypes.func,
	graphManagedCompete: PropTypes.func,
	graphManagedEnded: PropTypes.func,
	graphManagedRemoveEdge: PropTypes.func,
	graphManagedRemoveNode: PropTypes.func,
	graphNodeRoot: PropTypes.func,
	graphOperation: PropTypes.string,
	handlerNodeFocused: PropTypes.func,
	handlerNodeLostFocus: PropTypes.func,
	handlerNodeSelected: PropTypes.func,
	handlerViewport: PropTypes.func,
	initiateGraph: PropTypes.func,
	internalNotificationsAdd: PropTypes.func,
	io: PropTypes.func,
	joinLeaveRoomIO: PropTypes.func,
	learn: PropTypes.bool,
	leaveRoomIOInit: PropTypes.func,
	masterChangedIO: PropTypes.func,
	nodeCurrent: PropTypes.string,
	nodeFocused: PropTypes.object,
	nodeRoot: PropTypes.string,
	nodeSelected: PropTypes.object,
	nodesAdjacent: PropTypes.arrayOf(PropTypes.string),
	nodesHighlighted: PropTypes.arrayOf(PropTypes.string),
	randomGraph: PropTypes.func,
	randomGraphOffline: PropTypes.func,
	removeEdge: PropTypes.func,
	removeEdgeIO: PropTypes.func,
	removeNode: PropTypes.func,
	removeNodeIO: PropTypes.func,
	removeReceivedEdge: PropTypes.func,
	removeReceivedNode: PropTypes.func,
	room: PropTypes.object,
	roomChangeGraph: PropTypes.func,
	roomDeleteExisting: PropTypes.func,
	roomGetData: PropTypes.func,
	roomGetGraph: PropTypes.func,
	roomLeaveExisting: PropTypes.func,
	roomGetTraversal: PropTypes.func.isRequired,
	roomChangeTraversal: PropTypes.func.isRequired,
	socket: PropTypes.object,
	userHistoryAdd: PropTypes.func,
	username: PropTypes.string,
	visualization: PropTypes.object
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
		roomLeaveExisting: roomDeleted =>
			dispatch(roomLeaveExisting(roomDeleted)),
		roomDeleteExisting: () => dispatch(roomDeleteExisting()),
		roomGetGraph: () => dispatch(roomGetGraph()),
		roomChangeGraph: graph => dispatch(roomChangeGraph(graph)),
		roomGetTraversal: () => dispatch(roomGetTraversal()),
		roomChangeTraversal: graphTraversed =>
			dispatch(roomChangeTraversal(graphTraversed)),
		roomGetData: name => dispatch(roomGetData(name)),
		userHistoryAdd: score => dispatch(userHistoryAdd(score)),
		internalNotificationsAdd: (message, variant) =>
			dispatch(internalNotificationsAdd(message, variant))
	};
};

export const RoomPlayground = connect(
	mapStateToProps,
	mapDispatchToProps
)(
	withIO(
		withGraph(
			withAlgorithm(
				withPlayground(withStyles(styles)(withErrorHandler(Room)))
			)
		)
	)
);

export const RoomCompete = connect(
	mapStateToProps,
	mapDispatchToProps
)(withIO(withGraph(withCompete(withStyles(styles)(withErrorHandler(Room))))));

export const RoomLearn = connect(
	mapStateToProps,
	mapDispatchToProps
)(withGraph(withLearn(withStyles(styles)(withErrorHandler(Room)))));
