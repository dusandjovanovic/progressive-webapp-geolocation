import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import FaceIcon from "@material-ui/icons/Face";
import ChevronRightIcon from "@material-ui/icons/ArrowForwardIos";
import RoomBackground from "../../../../assets/images/room-background.jpg";
import RoomBackgroundPolution from "../../../../assets/images/room-background-polution.jpg";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import {
	ROOM_TYPE_POLUTION,
	ROOM_TYPE_PLACES
} from "../../../../utils/constants";

const roomCard = props => {
	const { classes } = props;

	const prettyDescription = type => {
		switch (type) {
			case ROOM_TYPE_POLUTION:
				return "This is room dedicated to sharing current Air polution metrics and insights.";
			case ROOM_TYPE_PLACES:
				return "This is room dedicated to sharing interesteing and intriguing places with others along with chatting.";
			default:
				return "This is an empty room.";
		}
	};

	const prettyDateFormat = time => {
		return new Date(time).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	const imageByType = type => {
		return type === ROOM_TYPE_PLACES
			? RoomBackground
			: RoomBackgroundPolution;
	};

	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.media}
				image={imageByType(props.type)}
			/>
			<CardContent className={classes.content}>
				<Typography variant="h5" color="primary">
					{props.name}
				</Typography>
				<Typography
					variant="caption"
					color="textSecondary"
					className={classes.borderlineText}
				>
					{prettyDateFormat(props.time)}
				</Typography>
				<Typography
					variant="subtitle2"
					color="textSecondary"
					className={classes.description}
				>
					{prettyDescription(props.type)}
				</Typography>
				<Divider variant="middle" light className={classes.divider} />
				<div className={classes.chipWrapper}>
					{props.users.map(user => (
						<Chip
							color="primary"
							key={user}
							label={user}
							className={classes.chip}
							avatar={
								<Avatar>
									<FaceIcon />
								</Avatar>
							}
						/>
					))}
				</div>
			</CardContent>
			<CardActions
				className={classes.actions}
				onClick={() => props.enterRoom(props.name, 10, props.type)}
			>
				<Button
					variant="text"
					color="secondary"
					className={classes.actionsText}
				>
					Join this room{" "}
					<ChevronRightIcon
						fontSize="small"
						className={classes.icon}
					/>
				</Button>
			</CardActions>
		</Card>
	);
};

roomCard.propTypes = {
	classes: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	time: PropTypes.string.isRequired,
	users: PropTypes.array.isRequired,
	enterRoom: PropTypes.func.isRequired
};

export default withStyles(styles)(React.memo(roomCard));
