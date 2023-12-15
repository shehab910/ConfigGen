import initialJsonData from "./OS_default.json";
import { getTaskDefaults } from "./utils";
/* eslint-disable react/prop-types */

const TableActions = ({ taskList, setTaskList, setJsonData }) => {
	const clearHandler = () => {
		setJsonData(initialJsonData);
		setTaskList([getTaskDefaults()]);
	};
	return (
		<>
			<button
				onClick={() => {
					const newTask = getTaskDefaults();
					newTask["Task-ID"] = +taskList[taskList.length - 1]["Task-ID"] + 1;
					setTaskList((prevData) => [...prevData, newTask]);
				}}
			>
				Add Task
			</button>
			<button onClick={clearHandler}>Clear</button>
		</>
	);
};

export default TableActions;
