import dynamicJsonData from "./OS_dynamic_props.json";
export const getTaskDefaults = () => {
	const taskList = { ...dynamicJsonData.TaskList };
	// map all array to the first element of that array
	// if the array is empty, map it to an empty string
	Object.keys(taskList).forEach((key) => {
		if (Array.isArray(taskList[key])) {
			taskList[key] = taskList[key][0] || "";
		}
	});
	return taskList;
};
