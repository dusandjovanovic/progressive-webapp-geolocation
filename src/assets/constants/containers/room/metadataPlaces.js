export const formElements = {
	name: {
		id: "name",
		value: "",
		config: {
			type: "text",
			placeholder: "name",
			label: "Name the insight you are about to share."
		},
		rules: {
			minLength: 1,
			maxLength: 128,
			required: true,
			email: false
		},
		valid: false,
		touched: false
	},
	media: {
		id: "media",
		value: null,
		valueUrl: null,
		config: {
			type: "image"
		},
		rules: {
			required: true
		},
		media: true,
		valid: false,
		touched: false
	}
};
