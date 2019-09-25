import React from "react";
import Grid from "@material-ui/core/Grid";
import RoomCard from "./room-card/roomCard";
import Grow from "@material-ui/core/Grow";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const roomView = props => {
	const { classes } = props;

	return (
		<Grid container justify="center" className={classes.root} spacing={4}>
			{props.rooms.length > 0
				? props.rooms.map((room, index) => {
						return (
							<Grow
								key={room["_id"]}
								in
								timeout={500 + index * 500}
							>
								<Grid item lg={4} md={6} xs={12}>
									<RoomCard
										type={room.roomType}
										id={room._id}
										name={room.name}
										time={room.time}
										users={room.users}
										enterRoom={props.enterRoom}
									/>
								</Grid>
							</Grow>
						);
				  })
				: null}
		</Grid>
	);
};

roomView.propTypes = {
	classes: PropTypes.object.isRequired,
	rooms: PropTypes.arrayOf(PropTypes.object),
	enterRoom: PropTypes.func.isRequired
};

export default withStyles(styles)(React.memo(roomView));
