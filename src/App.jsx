import { useState } from "react";
import staticJsonData from "./OS_static_props.json";
import dynamicJsonData from "./OS_dynamic_props.json";
import initialJsonData from "./OS_default.json";
import MultiTypeInput from "./MultiTypeInput";

import "./App.css";

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
			<h2>Entered JSON Information</h2>
			<pre>{JSON.stringify(jsonData, null, 2)}</pre>
			<pre>{JSON.stringify(taskList, null, 2)}</pre>
		</div>
	);
};

export default App;
// TODO: Generate button
// TODO: Clear button --> yrg3 ll default data
// TODO: Add task button
//list to curly braces function:
// `
// list_to_curly_braces = lambda x: "{" + ", ".join(list(map(str, x))) + "}"
// `
//generate c file function:
// `
// def generate_c_file(priority_list: list[int],
// task_list: list[str],
// PriorityLevelsSize: list[int]):
// """
// Return a string containing the C macros defined in the JSON file.
// """
// file = f"""
// /***********************************************************************************/
// /*				    			External constants		         				   */
// /***********************************************************************************/
// uint8 PriorityLevels [PRIORITY_LEVELS] = {list_to_curly_braces(priority_list)};

// OS_Tasks Tasks[] = {list_to_curly_braces(task_list)};

// TaskPriorityType PriorityLevelsSize [PRIORITY_LEVELS] = {list_to_curly_braces(PriorityLevelsSize)};

// """
// return file.strip()
// `
