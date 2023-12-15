const toUhexFormat = (x) => `(0x${x.toString(16).toUpperCase()}U)`;

const listToCurlyBraces = (x) => `{${x.map(String).join(", ")}}`;

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
export const generateHFile = (
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
