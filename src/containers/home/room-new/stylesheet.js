export const styles = theme => ({
	root: {
		marginBottom: theme.spacing(8),
		[theme.breakpoints.down("sm")]: {
			padding: theme.spacing(1)
		}
	},
	normalizedText: {
		fontWeight: "normal"
	},
	lightenedText: {
		fontWeight: "lighter"
	}
});
