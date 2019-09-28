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
	amenity: {
		id: "amenity",
		value: "",
		config: {
			type: "text",
			placeholder: "description",
			label: "Have anything to add? Write it here."
		},
		rules: {
			minLength: 0,
			maxLength: 128,
			required: false,
			email: false
		},
		valid: false,
		touched: false
	}
};
