import React from "react";
import FormContainer from "../../../../components/logic/form-container/formContainer";
import Annotation from "../../../../components/interface/annotation/annotation";
import { formElements } from "../../../../assets/constants/containers/room/metadataTraffic";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

import withModal from "../../../../hoc/with-modal/withModal";
import withErrorHandler from "../../../../hoc/with-error-handler/withErrorHandler";

import classNames from "classnames";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

class MetadataTraffic extends React.Component {
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

	handleValueChange = event => {
		this.setState({ value: Number(event.target.value) });
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
									Is there anything wrong with current traffic
									conditions?
								</Typography>

								<Grid container>
									<FormControl
										component="fieldset"
										className={classes.radioContainer}
									>
										<RadioGroup
											aria-label="traffic"
											name="traffic"
											value={this.state.value}
											onChange={this.handleValueChange}
											classes={{
												root: classes.radioGroup
											}}
										>
											<FormControlLabel
												value={1}
												control={<Radio />}
												label="Bad road"
											/>
											<FormControlLabel
												value={5}
												control={<Radio />}
												label="Accident"
											/>
											<FormControlLabel
												value={10}
												control={<Radio />}
												label="Roadblock"
											/>
										</RadioGroup>
									</FormControl>
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

MetadataTraffic.propTypes = {
	classes: PropTypes.object.isRequired,
	handleMetadata: PropTypes.func.isRequired,
	handleModalClose: PropTypes.func.isRequired
};

export default withModal(withStyles(styles)(withErrorHandler(MetadataTraffic)));
