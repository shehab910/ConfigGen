import { useState } from "react";
import staticJsonData from "./OS_static_props.json";
import dynamicJsonData from "./OS_dynamic_props.json";
import initialJsonData from "./OS_default.json";
import MultiTypeInput from "./MultiTypeInput";

import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/themes/prism.css"; //Example style, you can use another

import "./App.css";
import { generateHFile } from "./generator";

const getTaskDefaults = () => {
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
	const handleDynamicInputChange = (e, i) => {
		const { name, value, type, checked } = e.target;
		setTaskList((prevData) => {
			const newData = [...prevData];
			newData[i][name] = type === "checkbox" ? checked : value;
			return newData;
		});
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

	const taskListRows = (taskListSchema) => {
		return taskList.map((task, i) => {
			return (
				<tr key={i}>
					{Object.keys(taskListSchema).map((key) => (
						<td key={key}>
							<MultiTypeInput
								key={key}
								keyName={key}
								parent={taskListSchema}
								data={task}
								onChangeHandler={(e) => handleDynamicInputChange(e, i)}
								showLabel={false}
							/>
						</td>
					))}
				</tr>
			);
		});
	};

	const table = () => {
		const taskListSchema = dynamicJsonData.TaskList;

		return (
			<table className="dark-mode-table">
				<thead>
					<tr>
						{Object.keys(taskListSchema).map((key) => (
							<th key={key}>{key}</th>
						))}
					</tr>
				</thead>
				<tbody>{taskListRows(taskListSchema)}</tbody>
			</table>
		);
	};

	const clearHandler = () => {
		setJsonData(initialJsonData);
		setTaskList([getTaskDefaults()]);
	};

	const createAndDownloadFile = (fileName, fileContent) => {
		const element = document.createElement("a");
		const file = new Blob([fileContent], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = fileName;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
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
			{table()}
			<button
				onClick={() => {
					const newTask = getTaskDefaults();
					newTask["Task-ID"] = +taskList[taskList.length - 1]["Task-ID"] + 1;
					setTaskList((prevData) => [...prevData, newTask]);
				}}
			>
				Add Task
			</button>
			<button onClick={clearHandler}>Clear</button>
			{/* generate button */}
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
