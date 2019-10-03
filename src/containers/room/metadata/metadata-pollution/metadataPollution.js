import React from "react";
import FormContainer from "../../../../components/logic/form-container/formContainer";
import Annotation from "../../../../components/interface/annotation/annotation";
import { formElements } from "../../../../assets/constants/containers/room/metadataPollution";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

import withModal from "../../../../hoc/with-modal/withModal";
import withErrorHandler from "../../../../hoc/with-error-handler/withErrorHandler";

import classNames from "classnames";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";
import { IMPACT_COLORS } from "../../../../utils/constants";

class MetadataPollution extends React.Component {
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
			data.amenity.value
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
					{({ inputs, inputChangedHandler, submitHandler }) => (
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

								<TextField
									key={inputs.amenity.id}
									className={classNames(
										classes.textField,
										classes.textFieldBottom
									)}
									fullWidth={true}
									margin="normal"
									value={inputs.amenity.value}
									type={inputs.amenity.config.type}
									label={inputs.amenity.config.label}
									placeholder={
										inputs.amenity.config.placeholder
									}
									error={
										inputs.amenity.touched &&
										!inputs.amenity.valid
									}
									onChange={event =>
										inputChangedHandler(
											event,
											inputs.amenity.id
										)
									}
								/>

								<Typography
									variant="h6"
									className={classes.text}
									gutterBottom
								>
									How polluted is the area you are in?
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
												Not polluted
											</Typography>
										</Grid>
										<Grid item>
											<Typography
												variant="button"
												color="primary"
											>
												Highly polluted
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

MetadataPollution.propTypes = {
	classes: PropTypes.object.isRequired,
	handleMetadata: PropTypes.func.isRequired,
	handleModalClose: PropTypes.func.isRequired
};

export default withModal(
	withStyles(styles)(withErrorHandler(MetadataPollution))
);
