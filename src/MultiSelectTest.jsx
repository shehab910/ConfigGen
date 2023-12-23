import { useState, useEffect } from "react";

const MultiSelect = (props) => {
	// Use the useState hook to initialize the state
	const [options, setOptions] = useState([
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "cherry", label: "Cherry" },
		{ value: "date", label: "Date" },
		{ value: "elderberry", label: "Elderberry" },
	]);
	const [selected, setSelected] = useState([]);

	// Use the useEffect hook to handle the side effects
	useEffect(() => {
		// Do something when the component mounts or updates
	}, []); // Pass an empty array to run the effect only once

	// Define the event handlers
	const handleChange = (event) => {
		// Get the selected options from the event target
		const selectedOptions = Array.from(event.target.options)
			.filter((option) => option.selected)
			.map((option) => option.value);

		// Update the state with the new selected values
		setSelected(selectedOptions);
	};

	// Return the JSX element
	return (
		<div>
			<label htmlFor="fruits">Select your favorite fruits:</label>
			<select
				id="fruits"
				name="fruits"
				multiple
				value={selected}
				onChange={handleChange}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<p>You have selected: {selected.join(", ")}</p>
		</div>
	);
};

export default MultiSelect;
