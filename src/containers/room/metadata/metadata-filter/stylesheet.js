import { shallowShadow } from "../../../../assets/stylesheet";

export const styles = theme => ({
	root: {
		zIndex: 999,
		position: "fixed",
		top: "134px",
		right: theme.spacing(2),
		backgroundColor: "rgba(255,255,255,0.9)",
		width: "40rem",
		padding: theme.spacing(2),
		border: "1px solid " + theme.palette.secondary.main,
		borderRadius: theme.spacing(0.5),
		[theme.breakpoints.down("sm")]: {
			width: "calc(100% - 32px)"
		},
		...shallowShadow
	},
	inputsGroup: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(1)
	}
});
