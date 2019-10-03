export const styles = theme => ({
	tooltip: {
		position: "absolute",
		top: theme.spacing(16),
		left: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
		border: "1px solid rgba(212,212,212,0.5)",
		color: "#ffffff",
		zIndex: 1001
	},
	menuButton: {
		position: "absolute",
		marginLeft: theme.spacing(2),
		marginRight: theme.spacing(3),
		marginTop: theme.spacing(2)
	},
	hide: {
		display: "none"
	},
	drawer: {
		width: "30rem",
		flexShrink: 0,
		[theme.breakpoints.down("sm")]: {
			width: "100%"
		}
	},
	drawerPaper: {
		width: "30rem",
		height: "calc(100vh - 152px)",
		marginTop: "118px",
		zIndex: 1001,
		[theme.breakpoints.down("sm")]: {
			width: "100%"
		},
		overflow: "hidden"
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: "flex-end"
	},
	drawerContent: {
		margin: theme.spacing(0),
		height: "100%"
	}
});
