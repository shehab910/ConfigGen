const toUhexFormat = (x) => `(0x${x.toString(16).toUpperCase()}U)`;

const listToCurlyBraces = (x) => `{${x.map(String).join(", ")}}`;

/**
 * Gets the number of activations from a task object.
 * If the number of activations is 0, returns 1.
 * @param {object} task - The task object.
 * @returns {number} - The number of activations.
 */
const getNumberOfActivation = (task) =>
	task["Number Of Activation"] === 0 ? 1 : task["Number Of Activation"];

/**
 * Gets the list of each priority level size (number of each task * number of activations).
 * @param {Array<object>} taskList - The list of task objects.
 * @returns {Array<number>} - The list of priority level sizes.
 */
const getPriorityLevelsSize = (taskList) => {
	const priorityLevelsSorted = getPriorityLevelsSorted(taskList);
	const size = Array(priorityLevelsSorted.length).fill(0);

	taskList.forEach((task) => {
		const priority = task["Priority"];
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
	taskList.forEach((item) => set.add(item.Priority));
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
`.trim();

// Return a string containing the C macros defined in the JSON file.
export const generateCFile = (priority_list, task_list, PriorityLevelsSize) => {
	return `
	/***********************************************************************************/
	/*				    			External constants		         				   */
	/***********************************************************************************/
	uint8 PriorityLevels [PRIORITY_LEVELS] = ${listToCurlyBraces(priority_list)};
	
	OS_Tasks Tasks[] = ${listToCurlyBraces(task_list)};
	
	TaskPriorityType PriorityLevelsSize [PRIORITY_LEVELS] = ${listToCurlyBraces(
		PriorityLevelsSize
	)};
	`.trim();
};
