/* eslint-disable react/prop-types */
import Table from "./Table";
import { getResourceDefaults } from "../utils";
import dynamicJsonData from "../OS_dynamic_props.json";

const ResourceTable = ({
	ResourceList,
	setResourceList,
}) => {
	//TODO: if the value of the key is a list and the list is empty, then remove the key from ResourceListSchema
	const ResourceListSchema = dynamicJsonData.ResourceList;

	const onAddHandler = () => {
		const newTask = getResourceDefaults();
		if (ResourceList.length > 0) {
			newTask["Resource-ID"] =
				+ResourceList[ResourceList.length - 1]["Resource-ID"] +
				1;
			// newTask["Internal Resource Name"] = "InternalResource " + newTask["Internal Resource-ID"];
		}
		setResourceList((prevData) => [...prevData, newTask]);
	};
	const clearHandler = () => {
		setResourceList([]);
	};
	const checkIfDisabled = (_, key) => {
		let disabled = false;
		if (key === "Resource-ID") {
			disabled = true;
		}
		return disabled;
	};
	return (
		<Table
			tableName={"Resource"}
			itemList={ResourceList}
			setItemList={setResourceList}
			onAddHandler={onAddHandler}
			itemListSchema={ResourceListSchema}
			itemListDefault={getResourceDefaults()}
			onClearHandler={clearHandler}
			checkIfDisabled={checkIfDisabled}
		/>
	);
};
export default ResourceTable;