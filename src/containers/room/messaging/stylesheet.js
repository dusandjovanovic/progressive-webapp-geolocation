export const styles = theme => ({
	root: {
		padding: theme.spacing(1),
		backgroundColor: "#ffffff",
		overflow: "hidden",
		width: "100%"
	},
	messageContainer: {
		padding: theme.spacing(0.5),
		width: "100%",
		height: "auto",
		display: "flex",
		flexDirection: "row",
		alignItems: "flex-end",
		justifyContent: "flex-start"
	},
	messageView: {
		padding: theme.spacing(2, 0.5),
		width: "100%",
		maxHeight: "calc(100vh - 222px)",
		overflowY: "auto",
		display: "flex",
		flexDirection: "column"
	},
	messageHolder: {
		width: "100%"
	},
	message: {
		width: "auto",
		height: "auto",
		wordWrap: "break-word",
		padding: theme.spacing(1.25),
		margin: theme.spacing(0.5, 0)
	},
	messageLeft: {
		color: "white",
		float: "left",
		background: theme.palette.secondary.main,
		borderRadius: "14px"
	},
	messageRight: {
		float: "right",
		background: "#e6e5eb",
		borderRadius: "14px"
	},
	textField: {
		width: "80%",
		paddingRight: theme.spacing(2)
	},
	button: {
		width: "20%"
	}
});
