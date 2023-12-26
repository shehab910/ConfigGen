/* eslint-disable react/prop-types */
import Table from "./Table";
import { getAppModeDefault } from "../utils";
import dynamicJsonData from "../OS_dynamic_props.json";

//TODO: if the value of the key is a list and the list is empty, then remove the key from IRListSchema
const appModeListSchema = dynamicJsonData.AppMode;

const AppModeTable = ({
    appModeList,
	setAppModeList,
}) => {
	const onAddHandler = () => {
		const newTask = getAppModeDefault();
		if (appModeList.length > 0) {
			newTask["Application Mode-ID"] =
				+appModeList[appModeList.length - 1][
					"Application Mode-ID"
				] + 1;
			newTask["Application Mode Name"] = "";
		}
		setAppModeList((prevData) => [...prevData, newTask]);
	};
	const clearHandler = () => {
		setAppModeList([getAppModeDefault()]);
	};
	const checkIfDisabled = (item, key) => {
		let disabled = false;
		if (key === "Application Mode-ID" || item[key] === getAppModeDefault()[key]) {
			disabled = true;
		}
		return disabled;
	};
	return (
		<Table
			tableName={"Application Mode"}
			itemList={appModeList}
			setItemList={setAppModeList}
			onAddHandler={onAddHandler}
			itemListSchema={appModeListSchema}
			itemListDefault={getAppModeDefault()}
			onClearHandler={clearHandler}
			checkIfDisabled={checkIfDisabled}
		/>
	);
};
export default AppModeTable;
