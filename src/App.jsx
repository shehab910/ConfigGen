import { useEffect, useMemo, useState } from "react";
import MultiSelect from './multi-select/MultiSelect'
// import './dropdown_dark.css'
import MultiTypeInput from "./MultiTypeInput";
import { generateCFile, generateHFile } from "./generator";
import { getAppModeDefault, getTasksDefaults } from "./utils";

import staticJsonData from "./OS_static_props.json";
import defaultJsonData from "./OS_default.json";
import "./App.css";
import TaskTable from "./tables/TaskTable";
import InternalResourceTable from "./tables/InternalResourceTable";
import ResourceTable from "./tables/ResourceTable";
import dynamicJsonData from "./OS_dynamic_props.json";
import JSZip from "jszip";
import AppModeTable from "./tables/AppModeTable";
import useUpdateTaskList from "./hooks/useUpdateItemList";

// const createAndDownloadFile = (fileName, fileContent) => {
// 	const element = document.createElement("a");
// 	const file = new Blob([fileContent], { type: "text/plain" });
// 	element.href = URL.createObjectURL(file);
// 	element.download = fileName;
// 	document.body.appendChild(element); // Required for this to work in FireFox
// 	element.click();
// };

/**
 *
 * @param {[{name: string, content: string}]} files
 */
const zipFilesAndDownload = (files) => {
	const zip = new JSZip();
	const folder = zip.folder("Config Files");
	files.forEach((file) => {
		folder.file(file.name, file.content);
	});
	zip.generateAsync({ type: "blob" }).then((content) => {
		const date = new Date();
		const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}.${date.getMinutes()}`;
		saveAs(content, `config_${formattedDate}.zip`);
	});
};

const saveAs = (blob, fileName) => {
	const element = document.createElement("a");
	element.href = URL.createObjectURL(blob);
	element.download = fileName;
	document.body.appendChild(element); // Required for this to work in FireFox
	element.click();
};

const App = () => {
	const [jsonData, setJsonData] = useState(defaultJsonData);
	const [taskList, setTaskList] = useState([getTasksDefaults()]);
	const [taskListSchema, setTaskListSchema] = useState(
		dynamicJsonData.TaskList
	);
	const [internalResourceList, setInternalResourceList] = useState([]);
	const [ResourceList, setResourceList] = useState([]);
	const [appModeList, setAppModeList] = useState([getAppModeDefault()]);

	useUpdateTaskList(internalResourceList, setTaskList, setTaskListSchema, "Internal Resource", "Internal Resource Name");
	useUpdateTaskList(appModeList, setTaskList, setTaskListSchema, "Application Mode", "Application Mode Name");

	const handleStaticInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setJsonData((prevData) => ({
			...prevData,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const renderStaticInputs = () => {
		const staticJsonDataKeys = Object.keys(staticJsonData);
		return (
			<div className="static_component_container">
				{staticJsonDataKeys.map((key, i) => (
					<>
						<MultiTypeInput
							key={key}
							keyName={key}
							parent={staticJsonData}
							data={jsonData}
							onChangeHandler={handleStaticInputChange}
						/>
						{i !== staticJsonDataKeys.length - 1 && <hr />}
					</>
				))}
			</div>
		);
	};

	const generateFilesHandler = () => {
		const hCode = generateHFile(taskList, jsonData, ResourceList);
		// createAndDownloadFile("OS_Cfg.h", hCode);
		const cCode = generateCFile(taskList, internalResourceList, ResourceList);
		// createAndDownloadFile("OS_Cfg.c", cCode);
		zipFilesAndDownload([
			{ name: "OS_Cfg.h", content: hCode },
			{ name: "OS_Cfg.c", content: cCode },
		]);
	};
	const [value, setvalue] = useState('')

	const handleOnchange = val => {
		console.log(val);
		setvalue(val)
	}

	const options = useMemo(() => [
		{ label: 'Option 1', value: 'option_1' },
		{ label: 'Option 2', value: 'option_2' },
		{ label: 'Option 3', value: 'option_3' },
		{ label: 'Option 4', value: 'option_4' },
	],[]);
	
	const kharaHandler = (e) => {
		setOptions(prev => prev.slice(0,2))
		setvalue('')
	}

// 	const [value, setValue] = useState([])
//   const [optionsState, setOptionsState] = useState(userOptions || [])
	return (
		<div className="root">
			<MultiSelect
				onChange={handleOnchange}
				options={options}
				disableChip
				chipAlternateText="bahaa"
				// value={value}
				// setValue={setValue}
				// optionsState={optionsState}
				// setOptionsState={setOptionsState}
			/>
			<button onClick={kharaHandler}>khaar</button>
			<h1 className="myheader">AUTOSAR-compilant OS for HSM Generator</h1>
			{renderStaticInputs()}
			<hr />
			<ResourceTable
				ResourceList={ResourceList}
				setResourceList={setResourceList}
			/>
			<hr />
			<InternalResourceTable
				internalResourceList={internalResourceList}
				setInternalResourceList={setInternalResourceList}
			/>
			<hr />
			<TaskTable
				setTaskList={setTaskList}
				taskList={taskList}
				taskListSchema={taskListSchema}
			/>
			<hr />
			<AppModeTable
				appModeList={appModeList}
				setAppModeList={setAppModeList}
			/>
			<hr />
			<button className="button btn-green" onClick={generateFilesHandler}>
				Generate Files
			</button>
			<h2>Entered JSON Information</h2>
			<pre>{JSON.stringify(jsonData, null, 2)}</pre>
			<pre>{JSON.stringify(taskList, null, 2)}</pre>
		</div>
	);
};

export default App;

// Today TODOs:
// 1. Add Resource to Task Table

/*TODO*/
/*
==> the error appearing each time i refresh the page

==> a new coloumn in task table in which i can select multiple inputs of resource name

==> cfg.c : Resource array and Resource dynamic for each resource name

==> comments

==> internal resource
 
*/
