import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "../../../../components/interface/card/card";
import CardSimple from "../../../../components/interface/card-simple/cardSimple";
import ChartLine from "../../../../components/compound/chart-line/chartLine";
import ChartPie from "../../../../components/compound/chart-pie/chartPie";
import Table from "../../../../components/compound/table/table";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class DashboardOverview extends React.PureComponent {
	render() {
		const { classes } = this.props;

		return (
			<Grid container className={classes.root}>
				<Grid
					container
					justify="center"
					spacing={2}
					className={classes.container}
				>
					<Grid item xs={12} md={6} lg={3}>
						<CardSimple
							type="people"
							title="Number of friends"
							content={this.props.friendsCount}
							details="Number of users you have made friends with"
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<CardSimple
							type="sessions"
							title="Number of friend requests"
							content={this.props.requestsCount}
							details="Pending friend requests from others"
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<CardSimple
							type="timelapse"
							title="Shared insights"
							content={this.props.insightsCount}
							details="Number of times you shared isnights since registration"
						/>
					</Grid>
					<Grid item xs={12} md={6} lg={3}>
						<CardSimple
							type="dashboard"
							title="Share your insights"
							content="..."
							details="Head /home and join a room in realtime"
						/>
					</Grid>
				</Grid>
				<Grid
					container
					justify="center"
					spacing={2}
					className={classes.container}
				>
					<Grid item xs={12} lg={6}>
						<Card title="Your most recent insights">
							<ChartLine data={this.props.history.userHistory} />
						</Card>
					</Grid>
					<Grid item xs={12} lg={6}>
						<Card title="Statistics of shared insights by everyone">
							<ChartPie data={this.props.history.statistics} />
						</Card>
					</Grid>
				</Grid>
				<Grid
					container
					justify="center"
					spacing={2}
					className={classes.container}
				>
					<Grid item xs={12}>
						<Table
							title="Your recent insights"
							tableRows={5}
							tableData={this.props.history.userHistory}
						/>
					</Grid>
					<Grid item xs={12}>
						<Table
							title="Your friend's recent insights"
							tableRows={5}
							tableData={this.props.history.friendHistory}
						/>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

DashboardOverview.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	friendsCount: PropTypes.number.isRequired,
	requestsCount: PropTypes.number.isRequired,
	insightsCount: PropTypes.number.isRequired
};

export default withStyles(styles)(DashboardOverview);
