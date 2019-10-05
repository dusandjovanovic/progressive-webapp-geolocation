import { shallowShadow } from "../../../../assets/stylesheet";

export const styles = theme => ({
	content: {
		margin: "2rem auto",
		width: "100%",
		textAlign: "center",
		boxSizing: "border-box"
	},
	inputs: {
		display: "flex",
		padding: "1rem 6rem",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		[theme.breakpoints.down("md")]: {
			paddingLeft: "2rem",
			paddingRight: "2rem"
		},
		[theme.breakpoints.down("sm")]: {
			paddingLeft: "1rem",
			paddingRight: "1rem"
		}
	},
	inputsGroup: {
		margin: "2rem",
		display: "flex",
		flexDirection: "row"
	},
	img: {
		width: "auto",
		height: "auto",
		wordWrap: "break-word",
		padding: theme.spacing(2, 4),
		borderRadius: theme.spacing(1),
		marginBottom: theme.spacing(4),
		borderColor: `${theme.palette.primary.light}`,
		borderWidth: "1px",
		borderStyle: "solid",
		...shallowShadow
	},
	imgInputs: {
		padding: theme.spacing(4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		[theme.breakpoints.down("md")]: {
			padding: theme.spacing(0, 2)
		},
		[theme.breakpoints.down("sm")]: {
			padding: 0
		}
	},
	buttonContainer: {
		backgroundColor: "#eeeeee",
		width: "100%",
		height: "4rem",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	button: {
		margin: "1.5rem"
	},
	icon: {
		marginRight: "0.25rem"
	},
	text: {
		fontWeight: "lighter"
	},
	textField: {
		margin: "1.5rem 0rem"
	},
	textFieldBottom: {
		marginBottom: "2.5rem"
	},
	input: {
		display: "none"
	}
});
