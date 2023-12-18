import MultiTypeInput from "../MultiTypeInput";
import TableActions from "./TableActions";

import styles from "./table.module.css";

/* eslint-disable react/prop-types */

const Table = ({
	itemList,
	setItemList,
	itemListDefault,
	onAddHandler,
	itemListSchema,
	tableName,
	onClearHandler,
	checkIfDisabled,
}) => {
	const handleDynamicInputChange = (e, i) => {
		const { name, value, type, checked } = e.target;
		setItemList((prevData) => {
			const newData = [...prevData];
			newData[i][name] = type === "checkbox" ? checked : value;
			return newData;
		});
	};
	const taskListRows = itemList.map((item, i) => {
		return (
			<tr key={i}>
				{Object.keys(itemListSchema).map((key) => {
					let disabled = checkIfDisabled(item, key);
					return (
						<td key={key}>
							<MultiTypeInput
								key={key}
								keyName={key}
								parent={itemListSchema}
								data={item}
								onChangeHandler={(e) => handleDynamicInputChange(e, i)}
								showLabel={false}
								disabled={disabled}
							/>
						</td>
					);
				})}
			</tr>
		);
	});

	return (
		<div className="table_container">
			<table className={styles["dark-mode-table"]}>
				<thead>
					<tr>
						{Object.keys(itemListDefault).map((key) => (
							<th key={key}>{key}</th>
						))}
					</tr>
				</thead>
				<tbody>{taskListRows}</tbody>
			</table>
			<TableActions
				onClearHandler={onClearHandler}
				onAddHandler={onAddHandler}
				tableName={tableName}
			/>
		</div>
	);
};
export default Table;
