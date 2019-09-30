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
							title="Compete sessions"
							content={this.props.competeCount}
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
							<ChartLine
								data={[
									{
										date: "2019-09-23",
										value: 4
									},
									{
										date: "2019-09-24",
										value: 11
									},
									{
										date: "2019-09-25",
										value: 12
									},
									{
										date: "2019-09-26",
										value: 16
									},
									{
										date: "2019-09-27",
										value: 21
									},
									{
										date: "2019-09-28",
										value: 22
									},
									{
										date: "2019-09-29",
										value: 22
									},
									{
										date: "2019-09-30",
										value: 26
									}
								]}
							/>
						</Card>
					</Grid>
					<Grid item xs={12} lg={6}>
						<Card title="Statistics of shared insights by everyone">
							<ChartPie
								data={[
									{
										title: "Air pollution insights",
										percentage: 45
									},
									{
										title:
											"Places and locations sightseeing",
										percentage: 22
									},
									{
										title: "Traffic and roadblock insights",
										percentage: 33
									}
								]}
							/>
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
							title="Your most recent insights"
							tableRows={5}
							tableData={this.props.history}
						/>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

DashboardOverview.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.arrayOf(PropTypes.object).isRequired,
	friendsCount: PropTypes.number.isRequired,
	requestsCount: PropTypes.number.isRequired,
	competeCount: PropTypes.number.isRequired
};

export default withStyles(styles)(DashboardOverview);
