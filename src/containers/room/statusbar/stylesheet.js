export const styles = theme => ({
	root: {
		position: "fixed",
		bottom: 0,
		width: "100%",
		height: "34px",
		lineHeight: "34px",
		backgroundColor: theme.palette.primary.main,
		zIndex: 1001
	},
	element: {
		padding: theme.spacing(0, 0.5)
	},
	elementLight: {
		color: "#dedede"
	},
	elementHighlighted: {
		color: theme.palette.ternary.light
	},
	bordered: {
		borderRight: "1px solid #969696",
		padding: theme.spacing(0, 2),
		marginRight: theme.spacing(2)
	},
	managed: {
		float: "right",
		marginRight: theme.spacing(1)
	},
	elementManaged: {
		fontWeight: "normal",
		fontSize: "0.8rem",
		padding: theme.spacing(0.25, 1)
	}
});
