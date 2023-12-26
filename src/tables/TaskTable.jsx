/* eslint-disable react/prop-types */
import Table from "./Table";
import { getAppModeDefault, getTasksDefaults } from "../utils";

const TaskTable = ({ taskList, setTaskList, taskListSchema }) => {
	const onAddHandler = () => {
		const newTask = getTasksDefaults();
		newTask["Task-ID"] = +taskList[taskList.length - 1]["Task-ID"] + 1;
		setTaskList((prevData) => [...prevData, newTask]);
	};
	const clearHandler = () => {
		setTaskList([getTasksDefaults()]);
	};
	const checkIfDisabled = (item, key) => {
		let disabled = false;
		if (item["Task Type"] !== undefined) {
			disabled =
				item["Task Type"] === "Extended" && key === "Number Of Activation";
			if (disabled) {
				item["Number Of Activation"] = "1";
			}
		}
		if (key === "Task-ID") {
			disabled = true;
		}
		if(item["AutoStart"] === false && key === "Application Mode") {
			disabled = true;
			//TODO: PUT THE DEFAULT VALUE
		}
		return disabled;
	};
	return (
		<Table
			tableName={"Task"}
			itemList={taskList}
			setItemList={setTaskList}
			onAddHandler={onAddHandler}
			itemListSchema={taskListSchema}
			itemListDefault={getTasksDefaults()}
			onClearHandler={clearHandler}
			checkIfDisabled={checkIfDisabled}
			fullWidth
		/>
	);
};
export default TaskTable;
