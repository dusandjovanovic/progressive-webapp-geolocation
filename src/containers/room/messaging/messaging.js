import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grow from "@material-ui/core/Grow";
import withIOMessaging from "../../../hoc/with-io-messaging/withIOMessaging";
import PropTypes from "prop-types";

import classNames from "classnames";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class Messaging extends React.PureComponent {
	state = {
		message: ""
	};

	componentDidMount() {
		this.props.initWebsocketIO(this.props.room);
		this.props.socket.on("newMessage", received => {
			this.props.roomPushMessage(received.message);
		});
	}

	messageChange = event => {
		this.setState({
			message: event.target.value
		});
	};

	messageSend = async () => {
		const response = await this.props.roomAddMessage(this.state.message);
		this.props.messageSendIO(response.data.data, this.props.room);
		this.setState({
			message: ""
		});
	};

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.messageContainer}>
					<TextField
						id="input-message"
						label="Your message"
						placeholder="Type a message to send here.."
						value={this.state.message}
						onChange={this.messageChange}
						className={classes.textField}
					/>
					<Button
						color="primary"
						onClick={this.messageSend}
						className={classes.button}
					>
						Send
					</Button>
				</div>
				<div className={classes.messageView}>
					{this.props.messages.map(message => (
						<div
							key={message._id}
							className={classes.messageHolder}
						>
							<Grow in>
								<div
									className={classNames(
										classes.message,
										message.sender === this.props.username
											? classes.messageRight
											: classes.messageLeft
									)}
								>
									{message.sender === this.props.username
										? message.message
										: message.sender +
										  ": " +
										  message.message}
								</div>
							</Grow>
						</div>
					))}
				</div>
			</div>
		);
	}
}

Messaging.propTypes = {
	classes: PropTypes.object.isRequired,
	room: PropTypes.string,
	username: PropTypes.string.isRequired,
	messages: PropTypes.arrayOf(PropTypes.object),
	roomAddMessage: PropTypes.func.isRequired,
	roomPushMessage: PropTypes.func.isRequired,
	socket: PropTypes.object.isRequired,
	initWebsocketIO: PropTypes.func.isRequired,
	messageSendIO: PropTypes.func.isRequired
};

export default withIOMessaging(withStyles(styles)(Messaging));
