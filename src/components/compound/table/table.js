import React from "react";
import TableToolbar from "./table-toolbar/tableToolbar";
import TableHead from "./table-head/tableHead";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TablePagination from "@material-ui/core/TablePagination";
import PropTypes from "prop-types";

import { stableSort, getSorting } from "./table-utils";
import { styles } from "./stylesheet";
import withStyles from "@material-ui/core/styles/withStyles";

const rows = [
	{ id: "_id", disablePadding: false, label: "id" },
	{ id: "time", disablePadding: false, label: "Date added" },
	{ id: "author", disablePadding: false, label: "Author" },
	{ id: "value", disablePadding: false, label: "Insight's significant value" }
];

class table extends React.Component {
	state = {
		order: "desc",
		orderBy: "time",
		selected: [],
		data: this.props.tableData,
		page: 0,
		rowsPerPage: this.props.tableRows
	};

	componentDidUpdate(prevProps) {
		if (prevProps.tableData !== this.props.tableData)
			this.setState({
				data: this.props.tableData
			});
	}

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = "desc";

		if (this.state.orderBy === property && this.state.order === "desc") {
			order = "asc";
		}

		this.setState({ order, orderBy });
	};

	handleSelectAllClick = event => {
		if (event.target.checked) {
			this.setState(state => ({
				selected: state.data.map(n => n["_id"])
			}));
			return;
		}
		this.setState({ selected: [] });
	};

	handleClick = (event, id) => {
		const { selected } = this.state;
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		this.setState({ selected: newSelected });
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = event => {
		this.setState({ rowsPerPage: event.target.value });
	};

	handleAction = () => {};

	isSelected = id => this.state.selected.indexOf(id) !== -1;

	dateFormat = date => {
		return new Date(date).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	};

	render() {
		const { classes, title } = this.props;
		const {
			data,
			order,
			orderBy,
			selected,
			rowsPerPage,
			page
		} = this.state;
		const emptyRows =
			rowsPerPage -
			Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<TableToolbar
					title={title}
					numSelected={selected.length}
					action={this.handleAction}
				/>
				<div className={classes.tableWrapper}>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
					>
						<TableHead
							rows={rows}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
						/>
						<TableBody>
							{stableSort(data, getSorting(order, orderBy))
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map(n => {
									const isSelected = this.isSelected(
										n["_id"]
									);
									return (
										<TableRow
											hover
											onClick={event =>
												this.handleClick(
													event,
													n["_id"]
												)
											}
											role="checkbox"
											aria-checked={isSelected}
											tabIndex={-1}
											key={n["_id"]}
											selected={isSelected}
										>
											<TableCell padding="checkbox">
												<Checkbox
													color="primary"
													checked={isSelected}
												/>
											</TableCell>
											<TableCell>{n["_id"]}</TableCell>
											<TableCell>
												{this.dateFormat(
													n.properties.time
												)}
											</TableCell>
											<TableCell>
												{n.properties.author}
											</TableCell>
											<TableCell
												style={{
													fontWeight: "bold"
												}}
											>
												{n.properties.value}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={3} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Paper>
		);
	}
}

table.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
	tableRows: PropTypes.number.isRequired,
	action: PropTypes.func
};

export default withStyles(styles)(table);
