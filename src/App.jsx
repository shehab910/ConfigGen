import { useState } from "react";

import MultiTypeInput from "./MultiTypeInput";
import Table from "./Table";
import { generateHFile } from "./generator";
import { getTaskDefaults } from "./utils";

import staticJsonData from "./OS_static_props.json";
import defaultJsonData from "./OS_default.json";
import "./App.css";

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
	const [taskList, setTaskList] = useState([getTaskDefaults()]);

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
		createAndDownloadFile("test.h", hCode);
	};

	return (
		<div>
			<h1>Enter JSON Information</h1>
			{renderStaticInputs()}
			<Table
				setJsonData={setJsonData}
				setTaskList={setTaskList}
				taskList={taskList}
			/>

			<button onClick={generateFilesHandler}>Generate Files</button>
			<h2>Entered JSON Information</h2>
			<pre>{JSON.stringify(jsonData, null, 2)}</pre>
			<pre>{JSON.stringify(taskList, null, 2)}</pre>
		</div>
	);
};

export default App;
