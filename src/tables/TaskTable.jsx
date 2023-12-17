/* eslint-disable react/prop-types */
import Table from "../Table";
import { getTasksDefaults } from "../utils";

const TaskTable = ({ taskList, setTaskList, taskListSchema }) => {
	const onAddHandler = () => {
		const newTask = getTasksDefaults();
		newTask["Task-ID"] = +taskList[taskList.length - 1]["Task-ID"] + 1;
		setTaskList((prevData) => [...prevData, newTask]);
	};
	const clearHandler = () => {
		setTaskList([getTasksDefaults()]);
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
		/>
	);
};
export default TaskTable;
