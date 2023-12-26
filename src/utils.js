import dynamicJsonData from "./OS_dynamic_props.json";
export const getItemDefault = (schema) => {
	const defaultItem = { ...schema };
	// map all array to the first element of that array
	// if the array is empty, map it to an empty string
	Object.keys(defaultItem).forEach((key) => {
		if (Array.isArray(defaultItem[key])) {
			defaultItem[key] = defaultItem[key][0] || "";
		}
	});
	return defaultItem;
};
export const getTasksDefaults = () =>
	getItemDefault(dynamicJsonData.TaskList);
export const getInternalResourceDefaults = () =>
	getItemDefault(dynamicJsonData.InternalResource);
export const getResourceDefaults = () =>
	getItemDefault(dynamicJsonData.ResourceList);
export const getAppModeDefault = () =>
	getItemDefault(dynamicJsonData.AppMode);
