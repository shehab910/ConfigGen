import { useEffect, useState } from "react";

import { generateCFile, generateHFile } from "./generator";
import { getTasksDefaults } from "./utils";

import "./App.css";
import TaskTable from "./tables/TaskTable";
import InternalResourceTable from "./tables/InternalResourceTable";
import ResourceTable from "./tables/ResourceTable";
import dynamicJsonData from "./OS_dynamic_props.json";
import JSZip from "jszip";
import { staticPropsSchema } from "./schemas";
import StaticInputs from "./StaticInputs";

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
	const [jsonData, setJsonData] = useState(staticPropsSchema.getDefault());
	const [taskList, setTaskList] = useState([getTasksDefaults()]);
	const [taskListSchema, setTaskListSchema] = useState(
		dynamicJsonData.TaskList
	);
	const [internalResourceList, setInternalResourceList] = useState([]);
	const [ResourceList, setResourceList] = useState([]);

	useEffect(() => {
		setTaskListSchema((prevData) => {
			const newData = { ...prevData };
			newData["Internal Resource"] = internalResourceList.map(
				(item) => item["Internal Resource Name"]
			);
			return newData;
		});
		setTaskList((prevTaskList) => {
			const newTaskList = [...prevTaskList];
			newTaskList.forEach((task) => {
				if (
					!internalResourceList
						.map((ir) => ir["Internal Resource Name"])
						.includes(task["Internal Resource"])
				) {
					task["Internal Resource"] = "";
				}
			});
			return newTaskList;
		});
	}, [internalResourceList]);

	const handleStaticInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setJsonData((prevData) => ({
			...prevData,
			[name]: type === "checkbox" ? checked : value,
		}));
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

	return (
		<div className="root">
			<h1 className="myheader">AUTOSAR-compilant OS for HSM Generator</h1>
			<StaticInputs
				handleStaticInputChange={handleStaticInputChange}
				jsonData={jsonData}
			/>
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
 
*/
