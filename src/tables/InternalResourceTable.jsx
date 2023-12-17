/* eslint-disable react/prop-types */
import Table from "../Table";
import { getInternalResourceDefaults } from "../utils";
import dynamicJsonData from "../OS_dynamic_props.json";

const InternalResourceTable = ({
	internalResourceList,
	setInternalResourceList,
}) => {
	//TODO: if the value of the key is a list and the list is empty, then remove the key from IRListSchema
	const IRListSchema = dynamicJsonData.InternalResource;

	const onAddHandler = () => {
		const newTask = getInternalResourceDefaults();
		if (internalResourceList.length > 0) {
			newTask["Resource-ID"] =
				+internalResourceList[internalResourceList.length - 1]["Resource-ID"] +
				1;
			newTask["Resource Name"] = "InternalResource " + newTask["Resource-ID"];
		}
		setInternalResourceList((prevData) => [...prevData, newTask]);
	};
	const clearHandler = () => {
		setInternalResourceList([]);
	};
	return (
		<Table
			tableName={"Internal Resource"}
			itemList={internalResourceList}
			setItemList={setInternalResourceList}
			onAddHandler={onAddHandler}
			itemListSchema={IRListSchema}
			itemListDefault={getInternalResourceDefaults()}
			onClearHandler={clearHandler}
		/>
	);
};
export default InternalResourceTable;
