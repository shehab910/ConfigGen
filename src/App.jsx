import { useState } from "react";
import staticJsonData from "./OS_static_props.json";
import dynamicJsonData from "./OS_dynamic_props.json";
import initialJsonData from "./OS_default.json";
import dummyTasks from "./dummy_tasks.json";

import "./App.css";

const App = () => {
	// Assume jsonData is imported from an external file

	const [jsonData, setJsonData] = useState(initialJsonData);

	const [taskList, setTaskList] = useState(dummyTasks);

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
	const getInput = (key, parent, data, onChangeHandler, showLabel = true) => {
		return (
			<div key={key}>
				<label>
					{showLabel && key}
					{Array.isArray(parent[key]) && (
						<select
							name={key}
							value={data[key] || ""}
							onChange={onChangeHandler}
						>
							{/* <option value="">Select {key}</option> */}
							{parent[key].map((item, index) => (
								<option key={index} value={item}>
									{item}
								</option>
							))}
						</select>
					)}

					{!Array.isArray(parent[key]) && (
						<input
							type={typeof parent[key] === "boolean" ? "checkbox" : "text"}
							name={key}
							value={data[key] || ""}
							checked={typeof data[key] === "boolean" ? data[key] : undefined}
							onChange={onChangeHandler}
						/>
					)}
				</label>
			</div>
		);
	};
	const renderStaticInputs = () => {
		return Object.keys(staticJsonData).map((key) =>
			getInput(key, staticJsonData, jsonData, handleStaticInputChange)
		);
	};

	const taskListRows = (taskListSchema) => {
		return taskList.map((task, i) => {
			return (
				<tr key={i}>
					{Object.keys(taskListSchema).map((key) => (
						<td key={key}>
							{getInput(
								key,
								taskListSchema,
								task,
								(e) => handleDynamicInputChange(e, i),
								false
							)}
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
			{table()}
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
`
list_to_curly_braces = lambda x: "{" + ", ".join(list(map(str, x))) + "}"
`
//generate c file function:
`
def generate_c_file(priority_list: list[int],
task_list: list[str],
PriorityLevelsSize: list[int]):
"""
Return a string containing the C macros defined in the JSON file.
"""
file = f"""
/***********************************************************************************/
/*				    			External constants		         				   */
/***********************************************************************************/
uint8 PriorityLevels [PRIORITY_LEVELS] = {list_to_curly_braces(priority_list)};

OS_Tasks Tasks[] = {list_to_curly_braces(task_list)};

TaskPriorityType PriorityLevelsSize [PRIORITY_LEVELS] = {list_to_curly_braces(PriorityLevelsSize)};

"""
return file.strip()
`

