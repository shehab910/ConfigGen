const toUhexFormat = (x) => `(0x${toUhexOnenumberFormat(x.toString(16))+x.toString(16).toUpperCase()}U)`;

const toUhexOnenumberFormat = (x) => {

	if(x.length === 1)
		return `0`;
	return ``;
};

const listToCurlyBraces = (x) => `{${x.map(String).join(", ")}}`;

/**
 * Gets the number of activations from a task object.
 * If the number of activations is 0, returns 1.
 * @param {object} task - The task object.
 * @returns {number} - The number of activations.
 */
const getNumberOfActivation = (task) =>
	task["Number Of Activation"] === "0"
		? 1
		: Number(task["Number Of Activation"]);

/**
 * Gets the list of each priority level size (number of each task * number of activations).
 * @param {Array<object>} taskList - The list of task objects.
 * @returns {Array<number>} - The list of priority level sizes.
 */
const getPriorityLevelsSize = (taskList) => {
	const priorityLevelsSorted = getPriorityLevelsSorted(taskList);
	const size = Array(priorityLevelsSorted.length).fill(0);
	taskList.forEach((task) => {
		const priority = Number(task["Priority"]);
		const priorityIndex = priorityLevelsSorted.indexOf(priority);
		size[priorityIndex] += getNumberOfActivation(task);
	});
	return size;
};

/**
 * Converts a boolean value to "STD_ON" if true, or "STD_OFF" if false.
 * @param {boolean} bool - The boolean value to be converted.
 * @returns {string} - "STD_ON" if the boolean is true, "STD_OFF" otherwise.
 */
const getSTD_ON_OFF = (bool) => {
	return bool ? "STD_ON" : "STD_OFF";
};

const getPriorityLevelsSorted = (taskList = []) => {
	const set = new Set();
	taskList.forEach((task) => set.add(Number(task["Priority"])));
	return Array.from(set).sort((a, b) => b - a);
};

const getConformancesClass = (taskList) => {
	const priorityLevelsSize = getPriorityLevelsSize(taskList);
	let CC = "";
	let foundExtendedTask = false;
	taskList.forEach((task) => {
		if (task["Task Type"] === "Extended") {
			CC = "ECC";
			foundExtendedTask = true;
		}
	});
	if (!foundExtendedTask) {
		CC = "BCC";
	}
	for (let i = 0; i < priorityLevelsSize.length; i++) {
		if (priorityLevelsSize[i] > 1) {
			CC += "2_CLASS";
			return CC;
		}
	}
	CC += "1_CLASS";
	return CC;
};

const getMaxNoTasksAutoStart = (taskList) => {
	let ret = 0;
	taskList.forEach((task) => {
		if(task["AutoStart"]) {
			ret += 1;
		}
	});
	return ret;
}

const getTaskInfoText = (task, taskList) => {
	return `
	{
		.TaskStaticPriority = ${task["Priority"]},
		.TaskID = ${task["Task-ID"]},
		.ApplicationMode = ${task["Application Mode"]},
		.NumOfActivationRequests = ${getNumberOfActivation(task)},
		.PriorityQueueIndex = ${getPriorityLevelsSorted(taskList).indexOf(
			Number(task["Priority"])
		)},
		.TaskFlags = &Task${taskList.indexOf(task) + 1}Flags,
		.TaskStack = &Task${taskList.indexOf(task) + 1}Stack,
		.EntryPoint = ${task["Task Name"]},
		.InternalResource = ${task["Internal Resource"] ? "&"+task["Internal Resource"].replace(" ", "") : "NULL_PTR"},
		.TaskDynamics = &Task${taskList.indexOf(task) + 1}Dynamic
	}`.trim();
};

const getTaskListInfoText = (taskList) => {
	return taskList.map((task) => getTaskInfoText(task, taskList)).join(",\n\t");
};

//EntryPoint
const getTaskEPText = (task) => {
	return`
		extern void ${task["Task Name"]} (void);
	`.trim();
};

const getTaskListEPText = (taskList) => {
	return taskList.map((task) => getTaskEPText(task)).join("\n");
};

const getAutoStartTasksText = (taskList) => {
	return`
uint8 AutoStartTasks [${getMaxNoTasksAutoStart(taskList)}] = {
${getAutoStartTasksArrayValues(taskList)}
}
`.trim();
};

const getAutoStartTasksArrayValues =(taskList) => {
	let ret = "";
	const priorityLevelsSorted = getPriorityLevelsSorted(taskList);
	for(let i = 0; i < priorityLevelsSorted.length; i++) {
		taskList.forEach((task) => {
			if(Number(task["Priority"]) === priorityLevelsSorted[i] && task["AutoStart"] === true){
				ret += "\t"+task["Task-ID"]+",\n";
			}
		});
	}
	ret = ret.slice(0,-2);
	return `${ret}`;
};

const getTaskSchedulingPolicy = (task) => {
	return task["Preemptive Mode"] === "Full Preemptive"
		? "FULL_PREEMPTIVE_SCHEDULING"
		: "NON_PREEMPTIVE_SCHEDULING";
};

const getTaskFlagsText = (task) => {
	return `
{
	.Type = ${task["Task Type"]},
	.TaskSchedulingPolicy = ${getTaskSchedulingPolicy(task)}
}`.trim();
};

const getTaskListFlagsText = (taskList) => {
	return taskList
		.map((task, i) =>
			`TaskFlagsType Task${i + 1}Flags =\n${getTaskFlagsText(task)};`.trim()
		)
		.join("\n");
};

const getTaskCurrentPriority = (task, taskList) => {
	return task["Preemptive Mode"] === "Full Preemptive"
		? task["Priority"]
		: getPriorityLevelsSorted(taskList)[0];
};

const getTaskDynamicText = (task, taskList) => {
	return `
{
	.Context = NULL_PTR,
	.Resources = NULL_PTR,
	.EventsPending = 0,
	.EventsWaiting = 0,
	.TaskCurrentPriority = ${getTaskCurrentPriority(task, taskList)},
	.TaskState = SUSPENDED,
	.PendingActivationRequests = 0,
	.TaskIsPreempted = FALSE	
}`.trim();
};

const getTaskListDynamicText = (taskList) => {
	if (taskList.length === 0) return "";
	return taskList
		.map((task, i) =>
			`TaskDynamicType Task${i + 1}Dynamic =\n${getTaskDynamicText(
				task,
				taskList
			)};`.trim()
		)
		.join("\n");
};


const getTaskStackText = (task) => {
	return `
{
	.StackBase = NULL_PTR,
	.StackSize = ${task["Stack Size"]}
}`.trim();
};
const getTaskListStackText = (taskList) => {
	return taskList
		.map((task, i) =>
			`TaskStackType Task${i + 1}Stack =\n${getTaskStackText(task)};`.trim()
		)
		.join("\n");
};

const getIRCelingPriority = (IR, taskList) => {
	//filter all tasks that use this IR
	const filteredTasks = taskList.filter(
		(task) => task["Internal Resource"] === IR["Internal Resource Name"]
	);
	//get the highest priority of these tasks
	const highestPriority = Math.max(
		...filteredTasks.map((task) => {
			return Number(task["Priority"]);
		})
	);
	return highestPriority;
};

const getIRText = (IR, IRIndex, taskList) => {
	return `
	Os_InteranlResource ${IR["Internal Resource Name"].replace(" ", "")} =
{
	.CeilingPriority = ${getIRCelingPriority(IR, taskList)},
	.InternalResourceDynamics = &InernalResourceDynamic${IRIndex + 1}
};
	`.trim();
};

const getIRListText = (IRList, taskList) => {
	return IRList.map((IR, i) => getIRText(IR, i, taskList)).join("\n");
};

const getIRDynamicText = (IR) => {
	return `
	Os_InernalResourceDynamic ${IR["Internal Resource Name"].replace(" ", "")}Dynamic
{
	.TakenTaskPriority = 0,
	.TakenFlag = FALSE
};
	`.trim();
}

const getIRDynamicListText = (IRList) => {
	return IRList.map((IR) => getIRDynamicText(IR)).join("\n");
}






/**
 * Generates an H file with specified parameters.
 *
 * @param {number} number_of_tasks - The number of tasks.
 * @param {number} priority_levels - The number of priority levels.
 * @param {string} StartupHook - The Startup Hook.
 * @param {string} ShutdownHook - The Shutdown Hook.
 * @param {string} PreTaskHook - The Pre-Task Hook.
 * @param {string} PostTaskHook - The Post-Task Hook.
 * @param {string} ErrorHook - The Error Hook.
 * @param {string} ErrorCheckingType - The Error Checking Type.
 * @param {string} ConformanceClass - The Conformance Class.
 * @returns {string} - The generated H file.
 */
const getHFileText = (
	number_of_tasks,
	priority_levels,
	StartupHook,
	ShutdownHook,
	PreTaskHook,
	PostTaskHook,
	ErrorHook,
	ErrorCheckingType,
	ConformanceClass,
	taskList
) =>
	`
/***********************************************************************************/
/*                                  MACROS                                         */
/***********************************************************************************/
/* total number of tasks created by the user */
#define TASK_COUNT                                      ${toUhexFormat(
		number_of_tasks
	)}

/* number of priority levels assigned by the user */
#define PRIORITY_LEVELS                                 ${toUhexFormat(
		priority_levels
	)}

#define PRE_TASK_HOOK                                   ${PreTaskHook}   
					
#define POST_TASK_HOOK                                  ${PostTaskHook}

#define STARTUP_HOOK                                    ${StartupHook}

#define SHUTDOWN_HOOK                                   ${ShutdownHook} 

#define ERROR_HOOK                                      ${ErrorHook} 

#define ERROR_CHECKING_TYPE                             ERROR_CHECKING_${ErrorCheckingType.toUpperCase()}

/* system conformance class */
#define CONFORMANCE_CLASS                               ${ConformanceClass} 

#define MAX_NO_TASKS_AUTOSTART							${toUhexFormat(getMaxNoTasksAutoStart(taskList))}
`.trim();

// Return a string containing the C macros defined in the JSON file.
const getCFileText = (
	priority_list,
	PriorityLevelsSize,
	taskList,
	internalResourceList
) =>
	`
/***********************************************************************************/
/*				    			External constants		         				   */
/***********************************************************************************/
uint8 PriorityLevels [PRIORITY_LEVELS] = ${listToCurlyBraces(priority_list)};

TaskPriorityType PriorityLevelsSize [PRIORITY_LEVELS] = ${listToCurlyBraces(
		PriorityLevelsSize
	)};

${getTaskListEPText(taskList)}

${getTaskListFlagsText(taskList)}

${getTaskListStackText(taskList)}

${getIRDynamicListText(internalResourceList)}

${getIRListText(internalResourceList, taskList)}

${getTaskListDynamicText(taskList)}

OS_Task Tasks[TASK_COUNT] =
{
	${getTaskListInfoText(taskList)}
}

${getAutoStartTasksText(taskList)}

`.trim();

export const generateHFile = (taskList, jsonData) => {
	return getHFileText(
		taskList.length,
		getPriorityLevelsSorted(taskList).length,
		getSTD_ON_OFF(jsonData.StartupHook),
		getSTD_ON_OFF(jsonData.ShutdownHook),
		getSTD_ON_OFF(jsonData.PreTaskHook),
		getSTD_ON_OFF(jsonData.PostTaskHook),
		getSTD_ON_OFF(jsonData.ErrorHook),
		jsonData["Error Checking Type"],
		getConformancesClass(taskList),
		taskList
	);
};

export const generateCFile = (taskList, internalResourceList) => {
	return getCFileText(
		getPriorityLevelsSorted(taskList),
		getPriorityLevelsSize(taskList),
		taskList,
		internalResourceList
	);
};
