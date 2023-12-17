import dynamicJsonData from "./OS_dynamic_props.json";
export const getItemsDefaults = (schema) => {
	const itemList = { ...schema };
	// map all array to the first element of that array
	// if the array is empty, map it to an empty string
	Object.keys(itemList).forEach((key) => {
		if (Array.isArray(itemList[key])) {
			itemList[key] = itemList[key][0] || "";
		}
	});
	return itemList;
};
export const getTasksDefaults = () =>
	getItemsDefaults(dynamicJsonData.TaskList);
export const getInternalResourceDefaults = () =>
	getItemsDefaults(dynamicJsonData.InternalResource);
