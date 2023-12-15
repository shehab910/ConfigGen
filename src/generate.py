import json

to_Uhex_format = lambda x: "(0x{:02X}U)".format(x)

# map ints to strings
list_to_curly_braces = lambda x: "{" + ", ".join(list(map(str, x))) + "}"

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


def generate_h_file(number_of_tasks: int, 
                    priority_levels:int,
                    StartupHook: str,
                    ShutdownHook: str,
                    PreTaskHook: str,
                    PostTaskHook: str,
                    ErrorHook: str,
                    ErrorCheckingType: str,
                    ConformanceClass: str):
    """
    Return a string containing the C macros defined in the JSON file.
    """

    file = f"""
/***********************************************************************************/
/*                                  MACROS                                         */
/***********************************************************************************/
/* total number of tasks created by the user */
#define TASK_COUNT                                      {to_Uhex_format(number_of_tasks)}

/* number of priority levels assigned by the user */
#define PRIORITY_LEVELS                                 {to_Uhex_format(priority_levels)}


#define PRE_TASK_HOOK                                   {PreTaskHook}   
			                        
#define POST_TASK_HOOK                                  {PostTaskHook}

#define STARTUP_HOOK                                    {StartupHook}

#define SHUTDOWN_HOOK                                   {ShutdownHook} 

#define ERROR_HOOK                                      {ErrorHook} 

#define ERROR_CHECKING_TYPE                             ERROR_CHECKING_{ErrorCheckingType.upper()}

/* system conformance class */
#define CONFORMANCE_CLASS                               {ConformanceClass} 
"""
    return file.strip()

#getting the conformance class
def get_conformances_class( task_list: list[dict]) -> str:
    priority_levels_size = get_priority_levels_size(task_list)
    for i in range(len(priority_levels_size)):
        if priority_levels_size[i] > 1:
            return "BCC2_CLASS"
    return "BCC1_CLASS"    

#getting list of sorted priority levels
def get_priority_levels_sorted(task_list: list[dict]) -> list[int]:
    """
    Return the number of priority levels defined in the tasks list.
    """
    levels = set()
    for task in task_list:
        priority = task.get("Priority")
        levels.add(priority)
    return sorted(list(levels), reverse=True)

#in case of 0 activation return 1
def get_NumberOfActivation(task : dict) -> int:
    if task.get("Number Of Activation") == 0:
        return 1
    return task.get("Number Of Activation")
    

#getting list of each priority level size (number of each task * number of activations)
def get_priority_levels_size(task_list: list[dict]) -> list[int]:
    priority_levels_sorted = get_priority_levels_sorted(task_list)
    size = [0] * len(priority_levels_sorted)
    for task in task_list:
        priority = task.get("Priority")
        size[priority_levels_sorted.index(priority)] += get_NumberOfActivation(task)
    return size

#getting the number of priority levels
def get_priority_levels_len(task_list: list[dict]) -> int:
    return len(get_priority_levels_sorted(task_list))

#getting the number of tasks
def get_number_of_tasks(task_list: list[dict]) -> int:
    """
    Return the number of tasks defined in the tasks list.
    """
    return len(task_list)


# def get_tasks_per_priority(json_data: dict) -> int:
#     """
#     Return the number of tasks per priority defined in the JSON file.
#     """
#     # TODO: make sure that `TasksPerPriority` is defined in the JSON file
#     return json_data.get("TasksPerPriority")


# def generate_tasks(json_data: dict) :
#     tasks = json_data.get("TaskList")

#getting the names of tasks
def get_tasks_names(task_list: list[dict]) -> list[str]:
    """
    Return a list of tasks names defined in the tasks list.
    """
    return [task.get("name") for task in task_list]

#True->STD_ON and False->STD_OFF
def get_STD_ON_OFF(bool: bool) -> str:
    if bool:
        return "STD_ON"
    return "STD_OFF"


def Generate_C_H_files():
    with open('D:\\sho8l\\Graduation Project\\in progress\\Generator Json editor\\ssas-public-master\\tools\\json.editor\\config\\OS.json') as f:
        json_data = json.load(f)
    task_list = json_data.get("TaskList")
    STARTUP_HOOK = json_data.get("STARTUP_HOOK")
    h_filee = generate_h_file(
        get_number_of_tasks(task_list),
        get_priority_levels_len(task_list),
        get_STD_ON_OFF(json_data.get("StartupHook")),
        get_STD_ON_OFF(json_data.get("ShutdownHook")),
        get_STD_ON_OFF(json_data.get("PreTaskHook")),
        get_STD_ON_OFF(json_data.get("PostTaskHook")),
        get_STD_ON_OFF(json_data.get("ErrorHook")),
        json_data.get("Error Checking Type"),
        get_conformances_class(task_list))

    with open('D:\\sho8l\\Graduation Project\\in progress\\Generator Json editor\\ssas-public-master\\tools\\json.editor\\config\\OS_cfg.h', 'w') as f:
        f.write(h_filee)

    c_filee = generate_c_file(
        get_priority_levels_sorted(task_list),
        get_tasks_names(task_list),
        get_priority_levels_size(task_list)
    )
    with open('D:\\sho8l\\Graduation Project\\in progress\\Generator Json editor\\ssas-public-master\\tools\\json.editor\\config\\OS_cfg.c', 'w') as f:
        f.write(c_filee)