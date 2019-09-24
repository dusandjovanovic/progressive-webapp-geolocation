import React from "react";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import Particles from "react-particles-js";
import PropTypes from "prop-types";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class Homescreen extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<div className={classes.root}>
				<div className={classes.heading}>
					<Grow in timeout={1000}>
						<Typography
							variant="h3"
							gutterBottom
							className={classes.headingText}
						>
							mapped
						</Typography>
					</Grow>
					<Grow in timeout={1500}>
						<Typography
							variant="h5"
							className={classes.headingSubtext}
						>
							progressive geolocation-based application.
						</Typography>
					</Grow>
				</div>

				<Particles
					className={classes.particles}
					params={{
						particles: {
							number: {
								value: 64,
								density: {
									enable: true,
									value_area: 512
								}
							},
							size: {
								value: 2
							},
							move: {
								enable: true,
								direction: "none",
								outmode: "out",
								speed: 4,
								attract: {
									rotatex: 600,
									rotatey: 1200
								}
							}
						},
						interactivity: {
							events: {
								onhover: {
									enable: true,
									mode: "repulse"
								},
								onclick: {
									enable: true,
									mode: "push"
								}
							}
						}
					}}
				/>
			</div>
		);
	}
}

Homescreen.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Homescreen);
