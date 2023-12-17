/* eslint-disable react/prop-types */

const TableActions = ({ onAddHandler, tableName = "", onClearHandler }) => {
	return (
		<>
			<button onClick={onAddHandler}>Add {tableName}</button>
			<button onClick={onClearHandler}>Clear</button>
		</>
	);
};

export default TableActions;
