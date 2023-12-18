import MultiTypeInput from "./MultiTypeInput";
import TableActions from "./TableActions";

/* eslint-disable react/prop-types */

const Table = ({
	itemList,
	setItemList,
	itemListDefault,
	onAddHandler,
	itemListSchema,
	tableName,
	onClearHandler,
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
					let disabled = false;
					if (item["Task Type"] !== undefined) {
						disabled =
							item["Task Type"] === "Extended" &&
							key === "Number Of Activation";
						if (disabled) {
							item["Number Of Activation"] = "1";
						}
					}
					if(key === "Task-ID" || key === "Resource-ID")
					{
						disabled = true;
					}

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
		<div>
			<table className="dark-mode-table">
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
