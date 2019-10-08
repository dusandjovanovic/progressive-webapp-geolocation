import {
	primaryBoxShadow,
	primaryBoxShadowHover,
	transition,
	horizontalDivider
} from "../../../../assets/stylesheet";

export const styles = theme => ({
	card: {
		borderRadius: "0.25rem",
		...transition,
		...primaryBoxShadow,
		...primaryBoxShadowHover
	},
	media: {
		paddingTop: "56%"
	},
	content: {
		padding: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start"
	},
	description: {
		height: "2.5rem",
		overflow: "hidden",
		wordWrap: "break-word",
		textOverflow: "ellipsis"
	},
	actions: {
		padding: theme.spacing(1.25),
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	chip: {
		margin: theme.spacing(0.25)
	},
	chipWrapper: {
		height: "32px"
	},
	icon: {
		marginLeft: theme.spacing(0.5)
	},
	avatar: {
		width: "24px",
		height: "24px",
		backgroundColor: theme.palette.primary.dark
	},
	normalizedText: {
		fontWeight: "normal"
	},
	borderlineText: {
		marginBottom: theme.spacing(1)
	},
	...horizontalDivider(theme)
});
