import React from "react";
import FormContainer from "../../../../components/logic/form-container/formContainer";
import FormImage from "../../../../components/logic/form-image/formImage";
import Annotation from "../../../../components/interface/annotation/annotation";
import { formElements } from "../../../../assets/constants/containers/room/metadataPlaces";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

import withModal from "../../../../hoc/with-modal/withModal";
import withErrorHandler from "../../../../hoc/with-error-handler/withErrorHandler";

import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import { IMPACT_COLORS } from "../../../../utils/constants";

class MetadataPlaces extends React.Component {
	state = {
		value: 1,
		error: {
			hasError: false,
			name: null,
			description: null
		}
	};

	addMetadataHandler = data => {
		this.props.handleMetadata(
			data.name.value,
			this.state.value,
			data.media.value
		);
	};

	errorHandler = value => {
		this.setState(() => ({
			error: {
				...value
			}
		}));
	};

	handleValueChange = (event, value) => {
		this.setState({ value: Number(value) });
	};

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.content}>
				<FormContainer
					formElements={formElements}
					errorHandler={this.errorHandler}
					submitHandler={this.addMetadataHandler}
					className={classes.inputs}
				>
					{({
						inputs,
						inputChangedHandler,
						mediaChangedHandler,
						submitHandler
					}) => (
						<React.Fragment>
							<form className={classes.inputs}>
								<TextField
									key={inputs.name.id}
									className={classes.textField}
									fullWidth={true}
									margin="normal"
									required
									value={inputs.name.value}
									type={inputs.name.config.type}
									label={inputs.name.config.label}
									placeholder={inputs.name.config.placeholder}
									error={
										inputs.name.touched &&
										!inputs.name.valid
									}
									onChange={event =>
										inputChangedHandler(
											event,
											inputs.name.id
										)
									}
								/>

								<FormImage
									submitHandler={(file, fileUrl) =>
										mediaChangedHandler(
											file,
											fileUrl,
											"media"
										)
									}
									errorHandler={this.errorHandler}
								>
									{({
										file,
										fileURL,
										handleSelectedFile
									}) => (
										<div className={classes.imgInputs}>
											{fileURL ? (
												<Typography
													className={classes.img}
													variant="caption"
												>
													{file && file.name}
												</Typography>
											) : null}

											<input
												onChange={handleSelectedFile}
												accept="image/*"
												className={classes.input}
												id={formElements.media}
												multiple
												type="file"
											/>

											<label htmlFor={formElements.media}>
												<Button
													component="span"
													variant="outlined"
													color="primary"
													className={classes.button}
												>
													Upload a photo
												</Button>
											</label>
										</div>
									)}
								</FormImage>

								<Typography
									variant="h6"
									className={classes.text}
									gutterBottom
								>
									What do you think of this place?
								</Typography>

								<Grid container>
									<Grid container>
										<Slider
											className={classes.inputsGroup}
											defaultValue={this.state.value}
											getAriaValueText={value => value}
											valueLabelDisplay="on"
											step={1}
											marks
											min={1}
											max={10}
											onChange={this.handleValueChange}
											style={{
												color:
													IMPACT_COLORS[
														this.state.value - 1
													]
											}}
										/>
									</Grid>
									<Grid
										container
										direction="row"
										justify="space-between"
										alignItems="center"
									>
										<Grid item>
											<Typography
												variant="button"
												color="secondary"
											>
												Somewhat interesing
											</Typography>
										</Grid>
										<Grid item>
											<Typography
												variant="button"
												color="primary"
											>
												Very interesting
											</Typography>
										</Grid>
									</Grid>
								</Grid>

								<Annotation message="Your current location will be shared along with this insight. You should have given a permission previously." />
							</form>
							<div className={classes.buttonContainer}>
								<Button
									variant="text"
									size="large"
									color="primary"
									className={classes.button}
									onClick={event => {
										submitHandler(event);
										if (
											Object.keys(inputs).every(
												element => inputs[element].valid
											)
										)
											this.props.handleModalClose();
									}}
								>
									Share your insight
								</Button>

								<Button
									variant="text"
									size="large"
									className={classes.button}
									onClick={() =>
										this.props.handleModalClose()
									}
								>
									Close
								</Button>
							</div>
						</React.Fragment>
					)}
				</FormContainer>
			</div>
		);
	}
}

MetadataPlaces.propTypes = {
	classes: PropTypes.object.isRequired,
	handleMetadata: PropTypes.func.isRequired,
	handleModalClose: PropTypes.func.isRequired
};

export default withModal(withStyles(styles)(withErrorHandler(MetadataPlaces)));
