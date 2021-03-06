import React from "react";
import Grid from "@material-ui/core/Grid";
import RoomNew from "./room-new/roomNew";
import RoomView from "./room-view/roomView";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { roomGetAll, roomJoinExisting } from "../../store/actions/index";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import withErrorHandler from "../../hoc/with-error-handler/withErrorHandler";
import withGeolocation from "../../hoc/with-geolocation/withGeolocation";
import {
	ROOM_TYPE_PLACES,
	ROOM_TYPE_POLLUTION,
	ROOM_TYPE_TRAFFIC
} from "../../utils/constants";

class Home extends React.Component {
	state = {
		redirect: false,
		newRoom: false,
		error: {
			hasError: false,
			name: null,
			description: null
		},
		interval: null
	};
	interval;

	componentDidMount() {
		this.props.roomGetAll("all");
		this.setState({
			interval: setInterval(() => this.props.roomGetAll("all"), 10000)
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.interval);
	}

	enterRoom = async (id, name) => {
		await this.props.roomJoinExisting(
			id,
			name,
			this.props.location.latitude,
			this.props.location.longitude
		);
		if (this.props.data._id)
			this.setState({
				redirect: true
			});
	};

	render() {
		const { classes } = this.props;
		let redirection = null;
		if (
			this.state.redirect &&
			!this.props.waiting &&
			!this.props.error &&
			this.props.data._id
		)
			switch (this.props.data.roomType) {
				case ROOM_TYPE_PLACES:
					redirection = <Redirect to="/room/places" />;
					break;
				case ROOM_TYPE_POLLUTION:
					redirection = <Redirect to="/room/pollution" />;
					break;
				case ROOM_TYPE_TRAFFIC:
					redirection = <Redirect to="/room/traffic" />;
					break;
				default:
					redirection = null;
			}

		return (
			<Grid container className={classes.root}>
				{redirection}
				<Grid container justify="center" alignItems="center">
					<Grid item md={8} xs={10}>
						<RoomNew username={this.props.username} />
					</Grid>
					<Grid item xs={10}>
						<Divider variant="middle" className={classes.divider} />
					</Grid>
					<Grid item xs={12}>
						<RoomView
							enterRoom={(id, name) => this.enterRoom(id, name)}
							rooms={this.props.rooms}
							waiting={this.props.waiting}
						/>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = state => {
	return {
		username: state.auth.username,
		rooms: state.room.rooms,
		data: state.room.data,
		waiting: state.room.waiting,
		error: state.room.error
	};
};

const mapDispatchToProps = dispatch => {
	return {
		roomGetAll: mode => dispatch(roomGetAll(mode)),
		roomJoinExisting: (id, name, latitude, longitude) =>
			dispatch(roomJoinExisting(id, name, latitude, longitude))
	};
};

Home.propTypes = {
	classes: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	rooms: PropTypes.arrayOf(PropTypes.object).isRequired,
	data: PropTypes.object.isRequired,
	waiting: PropTypes.bool.isRequired,
	error: PropTypes.string,
	roomGetAll: PropTypes.func.isRequired,
	roomJoinExisting: PropTypes.func.isRequired
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withGeolocation(withStyles(styles)(withErrorHandler(Home))));
