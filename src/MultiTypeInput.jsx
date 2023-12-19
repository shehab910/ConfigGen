/* eslint-disable react/prop-types */
const MultiTypeInput = ({
	keyName,
	parent,
	data,
	onChangeHandler,
	showLabel = true,
	disabled = false,
}) => {
	const getInput = () => {
		if (Array.isArray(parent[keyName])) {
			return (
				<select
					name={keyName}
					value={data[keyName]}
					onChange={onChangeHandler}
					disabled={disabled}
				>
					<option disabled value="">
						Select {keyName}
					</option>
					{parent[keyName].map((item, index) => (
						<option key={index} value={item}>
							{item}
						</option>
					))}
				</select>
			);
		}
		return (
			<input
				className="myinput"
				type={typeof parent[keyName] === "boolean" ? "checkbox" : "text"}
				name={keyName}
				value={data[keyName] === undefined ? "" : data[keyName]}
				checked={typeof data[keyName] === "boolean" ? data[keyName] : undefined}
				onChange={onChangeHandler}
				disabled={disabled}
			/>
		);
	};
	return (
		<div>
			<label>{showLabel && keyName}</label>
			{getInput()}
		</div>
	);
};

export default MultiTypeInput;
