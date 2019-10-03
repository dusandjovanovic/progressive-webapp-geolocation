export const styles = theme => ({
	root: {
		marginTop: "64px",
		height: "100%",
		width: "100%",
		padding: "0",
		backgroundColor: "white"
	},
	base: {
		marginTop: "54px"
	},
	content: {
		flexGrow: 1,
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		marginLeft: "30rem",
		width: `calc(100% - 30rem)`,
		[theme.breakpoints.down("sm")]: {
			width: 0,
			marginLeft: 0
		}
	},
	contentShift: {
		transition: theme.transitions.create("margin", {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	}
});
