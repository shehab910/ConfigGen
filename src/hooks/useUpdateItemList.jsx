import { useEffect } from 'react';

/**
 * Updates the columns in the task list which are linked with other tables (ex. Internal Resource, Resource, etc.)
 * @param {*} itemList 
 * @param {*} setItemList 
 * @param {*} setTaskListSchema 
 * @param {string} propNameInTaskSchema The key of the property inside the task schema, it's also the same as the column name in the task table, ex. "Internal Resource"
 * @param {string} nameColValue The name of the column containg the names in the item list (which will values be in the combo list), ex. "Internal Resource Name"
 */
const useUpdateTaskList = (itemList, setTaskList, setTaskListSchema, propNameInTaskSchema, nameColValue) => {
    useEffect(() => {
        	setTaskListSchema((prevData) => {
        		const newData = { ...prevData };
        		newData[propNameInTaskSchema] = itemList.map(
        			(item) => item[nameColValue]
        		);
        		return newData;
        	});
        	setTaskList((prevTaskList) => {
        		const newTaskList = [...prevTaskList];
        		newTaskList.forEach((task) => {
        			if (
        				!itemList
        					.map((ir) => ir[nameColValue])
        					.includes(task[propNameInTaskSchema])
        			) {
        				task[propNameInTaskSchema] = "";
        			}
        		});
        		return newTaskList;
        	});
        }, [itemList]);
};

export default useUpdateTaskList;
