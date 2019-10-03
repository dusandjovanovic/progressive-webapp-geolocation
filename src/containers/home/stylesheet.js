import { horizontalDivider } from "../../assets/stylesheet";

export const styles = theme => ({
	root: {
		marginTop: "64px",
		padding: theme.spacing(4, 0),
		width: "100%",
		overflow: "auto"
	},
	...horizontalDivider(theme)
});
