import * as yup from "yup";

export const staticPropsSchema = yup.object().shape({
	StartupHook: yup
		.boolean()
		.required()
		.default(false)
		.label("Startup Hook")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	ShutdownHook: yup
		.boolean()
		.required()
		.default(false)
		.label("Shutdown Hook")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	ErrorHook: yup
		.boolean()
		.required()
		.default(false)
		.label("Error Hook")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	PreTaskHook: yup
		.boolean()
		.required()
		.default(false)
		.label("Pre-Task Hook")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	blz: yup
		.string()
		.required()
		.label("blz")
		.default("")
		.meta({
			inputProps: {
				type: "text",
				placeholder: "blz...",
			},
		}),
	PostTaskHook: yup
		.boolean()
		.required()
		.default(false)
		.label("Post-Task Hook")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	"Error Checking Type": yup
		.string()
		.oneOf(["Standard", "Extended"])
		.required()
		.default("Standard")
		.label("Error Checking Type")
		.meta({
			inputProps: {
				type: "select",
			},
		}),
	blez: yup
		.string()
		.required()
		.label("blez")
		.default("")
		.meta({
			inputProps: {
				type: "text",
				placeholder: "blez...",
			},
		}),
});

// "TaskList": {
// 	"Task-ID": 0,
// 	"Task Name": "",
// 	"Stack Size": 512,
// 	"AutoStart": false,
// 	"Resources": {
// 		"type": "multi-select",
// 		"options": [],
// 		"value": []
// 	},
// 	"Priority": "0",
// 	"Number Of Activation": "1",
// 	"Internal Resource": [],
// 	"Preemptive Mode": ["Full Preemptive", "Non Preemptive"],
// 	"Task Type": ["Basic", "Extended"],
// 	"Application Mode": ""
// },

export const taskListSchema = yup.object().shape({
	"Task-ID": yup
		.number()
		.required()
		.label("Task ID")
		.default(0)
		.meta({
			inputProps: {
				type: "number",
				disabled: true,
			},
		}),
	"Task Name": yup
		.string()
		.required()
		.label("Task Name")
		.default("")
		.meta({
			inputProps: {
				type: "text",
				placeholder: "Task 1",
			},
		}),
	"Stack Size": yup
		.number()
		.required()
		.label("Stack Size")
		.default(512)
		.meta({
			inputProps: {
				type: "number",
				placeholder: "512",
			},
		}),
	AutoStart: yup
		.boolean()
		.required()
		.default(false)
		.label("Auto Start")
		.meta({
			inputProps: {
				type: "checkbox",
			},
		}),
	// Resources: yup
	// 	.array()
	// 	.of(yup.string())
	// 	.required()
	// 	.label("Resources")
	// 	.default([])
	// 	.meta({
	// 		inputProps: {
	// 			type: "multi-select",
	// 			options: [],
	// 		},
	// 	}),
	Priority: yup
		.number()
		.required()
		.label("Priority")
		.default(0)
		.meta({
			inputProps: {
				type: "text",
			},
		}),
});
