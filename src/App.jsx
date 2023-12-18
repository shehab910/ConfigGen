import { useEffect, useState } from "react";

import MultiTypeInput from "./MultiTypeInput";
// import Table from "./Table";
import { generateCFile, generateHFile } from "./generator";
import { getTasksDefaults } from "./utils";

import staticJsonData from "./OS_static_props.json";
import defaultJsonData from "./OS_default.json";
import "./App.css";
import TaskTable from "./tables/TaskTable";
import InternalResourceTable from "./tables/InternalResourceTable";
import dynamicJsonData from "./OS_dynamic_props.json";

const createAndDownloadFile = (fileName, fileContent) => {
	const element = document.createElement("a");
	const file = new Blob([fileContent], { type: "text/plain" });
	element.href = URL.createObjectURL(file);
	element.download = fileName;
	document.body.appendChild(element); // Required for this to work in FireFox
	element.click();
};

const App = () => {
	// Assume jsonData is imported from an external file
	const [jsonData, setJsonData] = useState(defaultJsonData);
	const [taskList, setTaskList] = useState([getTasksDefaults()]);
	const [taskListSchema, setTaskListSchema] = useState(
		dynamicJsonData.TaskList
	);
	const [internalResourceList, setInternalResourceList] = useState([]);

	useEffect(() => {
		setTaskListSchema((prevData) => {
			const newData = { ...prevData };
			newData["Internal Resource"] = internalResourceList.map(
				(item) => item["Resource Name"]
			);
			return newData;
		});
	}, [internalResourceList]);

	const handleStaticInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setJsonData((prevData) => ({
			...prevData,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const renderStaticInputs = () => {
		return Object.keys(staticJsonData).map((key) => (
			<MultiTypeInput
				key={key}
				keyName={key}
				parent={staticJsonData}
				data={jsonData}
				onChangeHandler={handleStaticInputChange}
			/>
		));
	};

	const generateFilesHandler = () => {
		const hCode = generateHFile(taskList, jsonData);
		createAndDownloadFile("OS_Cfg.h", hCode);
		const cCode = generateCFile(taskList, internalResourceList);
		createAndDownloadFile("OS_Cfg.c", cCode);
	};

	return (
		<div className="root" >
			<nav className="mynavbar">
				<h1 className="myheader">AUTOSAR-compilant OS for HSM Generator</h1>
			</nav>
			{renderStaticInputs()}
			<InternalResourceTable
				internalResourceList={internalResourceList}
				setInternalResourceList={setInternalResourceList}
			/>
			<TaskTable
				setTaskList={setTaskList}
				taskList={taskList}
				taskListSchema={taskListSchema}
			/>
			<button className="button" onClick={generateFilesHandler}>Generate Files</button>
			<h2>Entered JSON Information</h2>
			<pre>{JSON.stringify(jsonData, null, 2)}</pre>
			<pre>{JSON.stringify(taskList, null, 2)}</pre>
		</div>
	);
};

export default App;

/*TODO*/
/*

==> download Cfg files in specific folder
 
*/
