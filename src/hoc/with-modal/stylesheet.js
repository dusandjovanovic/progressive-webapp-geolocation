export const styles = theme => ({
	container: {
		width: "60%",
		height: "auto",
		margin: "auto",
		backgroundColor: "#ffffff",
		boxShadow: "0px 0px 20px rgba(122,122,122,0.4)",
		[theme.breakpoints.down("sm")]: {
			width: "98%"
		}
	},
	modal: {
		overflow: "auto",
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});
