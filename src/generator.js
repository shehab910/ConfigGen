const toUhexFormat = (x) => `(0x${x.toString(16).toUpperCase()}U)`;

const listToCurlyBraces = (x) => `{${x.map(String).join(", ")}}`;

/**
 * Gets the number of activations from a task object.
 * If the number of activations is 0, returns 1.
 * @param {object} task - The task object.
 * @returns {number} - The number of activations.
 */
const getNumberOfActivation = (task) => 
	task["Number Of Activation"] === "0" ? 1 : Number(task["Number Of Activation"]);

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
	for (let i = 0; i < priorityLevelsSize.length; i++) {
		if (priorityLevelsSize[i] > 1) {
			return "BCC2_CLASS";
		}
		return "BCC1_CLASS";
	}
};

const getTaskInfoText = (task,taskList) => {
return`
	{
		.TaskStaticPriority = ${task["Priority"]},
		.TaskID = ${task["Task-ID"]},
		.ApplicationMode = ${task["Application Mode"]},
		.NumOfActivationRequests = ${getNumberOfActivation(task)},
		.PriorityQueueIndex = ${getPriorityLevelsSorted(taskList).indexOf(Number(task["Priority"]))},
		.TaskFlags = &Task${taskList.indexOf(task)+1}Flags,
		.TaskStack = &Task${taskList.indexOf(task)+1}Stack,
		.EntryPoint = ${task["Entry Point"]},
		.InternalResource ,
		.TaskDynamics = &Task${taskList.indexOf(task)+1}Dynamic
	}`.trim();
};

const getTaskListInfoText = (taskList) => {
	return taskList.map((task) => getTaskInfoText(task,taskList)).join(",\n\t");
}

const getTaskSchedulingPolicy = (task) => {
	return task["Preemptive Mode"] === "Full Preemptive" ? "FULL_PREEMPTIVE_SCHEDULING" : "NON_PREEMPTIVE_SCHEDULING";
}

const getTaskFlagsText = (task) => {
	return `
{
	.Type = ${task["Task Type"]},
	.TaskSchedulingPolicy = ${getTaskSchedulingPolicy(task)}
}`.trim();
};

const getTaskListFlagsText = (taskList) => {
	return taskList.map((task,i) => `TaskFlagsType Task${i+1}Flags =\n${getTaskFlagsText(task)};`.trim()).join("\n");

}

const getTaskCurrentPriority = (task,taskList) => {
	return task["Preemptive Mode"] === "Full Preemptive" ? task["Priority"] : getPriorityLevelsSorted(taskList)[0];
}

const getTaskDynamicText = (task,taskList) => {
	return `
{
	.Context = NULL_PTR,
	.Resources = NULL_PTR,
	.EventsPending = 0,
	.EventsWaiting = 0,
	.TaskCurrentPriority = ${getTaskCurrentPriority(task,taskList)},
	.TaskState = SUSPENDED,
	.PendingActivationRequests = 0,
	.TaskIsPreempted = FALSE	
}`.trim();
};

const getTaskListDynamicText = (taskList) => {
	return taskList.map((task,i) => `TaskDynamicType Task${i+1}Dynamic =\n${getTaskDynamicText(task,taskList)};`.trim()).join("\n");
}

// TaskStackType TaskStack =
// {
// 	.StackBase = (void*)0x80006546,
// 	.StackSize = 200
// };
const getTaskStackText = (task) => {
	return `
{
	.StackBase = NULL_PTR,
	.StackSize = ${task["Stack Size"]}
}`.trim();
}
const getTaskListStackText = (taskList) => {
	return taskList.map((task,i) => `TaskStackType Task${i+1}Stack =\n${getTaskStackText(task)};`.trim()).join("\n");
}

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
		getConformancesClass(taskList)
	);
};

export const generateCFile = (taskList) => {
	return getCFileText(
		getPriorityLevelsSorted(taskList),
		getPriorityLevelsSize(taskList),
		taskList
	);
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
export const getHFileText = (
	number_of_tasks,
	priority_levels,
	StartupHook,
	ShutdownHook,
	PreTaskHook,
	PostTaskHook,
	ErrorHook,
	ErrorCheckingType,
	ConformanceClass
) =>
	`
/***********************************************************************************/
/*                                  MACROS                                         */
/***********************************************************************************/
/* total number of tasks created by the user */
#define TASK_COUNT                                      ${toUhexFormat(number_of_tasks)}

/* number of priority levels assigned by the user */
#define PRIORITY_LEVELS                                 ${toUhexFormat(priority_levels)}

#define PRE_TASK_HOOK                                   ${PreTaskHook}   
					
#define POST_TASK_HOOK                                  ${PostTaskHook}

#define STARTUP_HOOK                                    ${StartupHook}

#define SHUTDOWN_HOOK                                   ${ShutdownHook} 

#define ERROR_HOOK                                      ${ErrorHook} 

#define ERROR_CHECKING_TYPE                             ERROR_CHECKING_${ErrorCheckingType.toUpperCase()}

/* system conformance class */
#define CONFORMANCE_CLASS                               ${ConformanceClass} 
`.trim();


// Return a string containing the C macros defined in the JSON file.
export const getCFileText = (
	priority_list, 
	PriorityLevelsSize,
	taskList
) => 
	`
/***********************************************************************************/
/*				    			External constants		         				   */
/***********************************************************************************/
uint8 PriorityLevels [PRIORITY_LEVELS] = ${listToCurlyBraces(priority_list)};

TaskPriorityType PriorityLevelsSize [PRIORITY_LEVELS] = ${listToCurlyBraces(PriorityLevelsSize)};

OS_Task Tasks[TASK_COUNT] =
{
	${getTaskListInfoText(taskList)}
}

${getTaskListFlagsText(taskList)}

${getTaskListDynamicText(taskList)}

${getTaskListStackText(taskList)}
`.trim();

