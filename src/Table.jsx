import MultiTypeInput from "./MultiTypeInput";
import dynamicJsonData from "./OS_dynamic_props.json";
import TableActions from "./TableActions";

/* eslint-disable react/prop-types */

const Table = ({ taskList, setJsonData, setTaskList }) => {
	const taskListSchema = dynamicJsonData.TaskList;
	const handleDynamicInputChange = (e, i) => {
		const { name, value, type, checked } = e.target;
		setTaskList((prevData) => {
			const newData = [...prevData];
			newData[i][name] = type === "checkbox" ? checked : value;
			return newData;
		});
	};
	const taskListRows = taskList.map((task, i) => {
		return (
			<tr key={i}>
				{Object.keys(taskListSchema).map((key) => (
					<td key={key}>
						<MultiTypeInput
							key={key}
							keyName={key}
							parent={taskListSchema}
							data={task}
							onChangeHandler={(e) => handleDynamicInputChange(e, i)}
							showLabel={false}
						/>
					</td>
				))}
			</tr>
		);
	});

	return (
		<div>
			<table className="dark-mode-table">
				<thead>
					<tr>
						{Object.keys(taskListSchema).map((key) => (
							<th key={key}>{key}</th>
						))}
					</tr>
				</thead>
				<tbody>{taskListRows}</tbody>
			</table>
			<TableActions
				setJsonData={setJsonData}
				setTaskList={setTaskList}
				taskList={taskList}
			/>
		</div>
	);
};
export default Table;
