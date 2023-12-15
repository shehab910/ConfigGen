import { useState } from "react";
import staticJsonData from "./OS_static_props.json";
import initialJsonData from "./OS_default.json";
import MultiTypeInput from "./MultiTypeInput";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/themes/prism.css"; //Example style, you can use another

import "./App.css";
import { generateHFile } from "./generator";
import { getTaskDefaults } from "./utils";
import Table from "./Table";

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

	const [jsonData, setJsonData] = useState(initialJsonData);

	const [taskList, setTaskList] = useState([getTaskDefaults()]);

	const [code, setCode] = useState(``);

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
		const hCode = generateHFile(0, 0, "", "", "", "", "", "", "");
		setCode(hCode);
		createAndDownloadFile("test.h", hCode);
	};

	return (
		<div>
			<h1>Enter JSON Information</h1>
			{renderStaticInputs()}
			{/* button to add a new task to the task list */}
			<Table
				setJsonData={setJsonData}
				setTaskList={setTaskList}
				taskList={taskList}
			/>

			<button onClick={generateFilesHandler}>Generate Files</button>
			<h2>Entered JSON Information</h2>
			<pre>{JSON.stringify(jsonData, null, 2)}</pre>
			<pre>{JSON.stringify(taskList, null, 2)}</pre>
			<Editor
				value={code}
				onValueChange={(code) => setCode(code)}
				highlight={(code) => highlight(code, languages.c)}
				padding={10}
				style={{
					fontFamily: '"Fira code", "Fira Mono", monospace',
					fontSize: 12,
				}}
			/>
		</div>
	);
};

export default App;
