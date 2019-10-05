import React from "react";
import PropTypes from "prop-types";

class FormImage extends React.Component {
	state = {
		file:
			this.props.formDefaults && this.props.formDefaults.file
				? this.props.formDefaults.file
				: null,
		fileURL: null
	};

	handleSelectedFile = event => {
		const file = event.target.files[0];
		const reader = new FileReader();
		if (file != null) {
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				this.setState(() => ({
					file: file,
					fileURL: reader.result
				}));
				this.props.submitHandler(file, reader.result);
			};
			reader.onerror = () => {
				this.props.errorHandler({
					hasError: true,
					name: "Error adding a photo",
					description:
						"There was an error adding a photo, please try again."
				});
			};
		}
	};

	render() {
		return (
			<React.Fragment>
				{this.props.children({
					...this.state,
					handleSelectedFile: this.handleSelectedFile
				})}
			</React.Fragment>
		);
	}
}

FormImage.propTypes = {
	formDefaults: PropTypes.object,
	submitHandler: PropTypes.func.isRequired,
	errorHandler: PropTypes.func.isRequired,
	children: PropTypes.func.isRequired,
	image: PropTypes.bool
};

export default FormImage;
