import { boxShadow } from "../../../../assets/stylesheet";

export const styles = theme => ({
	root: {
		width: "60%",
		margin: "auto",
		marginTop: theme.spacing(12),
		padding: theme.spacing(6),
		border: "1px solid #ebebeb",
		backgroundColor: "#f8f8f8",
		[theme.breakpoints.down("sm")]: {
			width: "90%"
		},
		...boxShadow
	},
	image: {
		width: "33%",
		[theme.breakpoints.down("sm")]: {
			width: "100%"
		}
	}
});
