/* eslint-disable react/prop-types */
const MultiTypeInput = ({
	keyName,
	parent,
	data,
	onChangeHandler,
	showLabel = true,
}) => {
	return (
		<div>
			<label>
				{showLabel && keyName}
				{Array.isArray(parent[keyName]) && (
					<select
						name={keyName}
						value={data[keyName]}
						onChange={onChangeHandler}
					>
						{/* <option value="">Select {keyName}</option> */}
						{parent[keyName].map((item, index) => (
							<option key={index} value={item}>
								{item}
							</option>
						))}
					</select>
				)}

				{!Array.isArray(parent[keyName]) && (
					<input
						type={typeof parent[keyName] === "boolean" ? "checkbox" : "text"}
						name={keyName}
						value={data[keyName] === undefined ? "" : data[keyName]}
						checked={
							typeof data[keyName] === "boolean" ? data[keyName] : undefined
						}
						onChange={onChangeHandler}
					/>
				)}
			</label>
		</div>
	);
};

export default MultiTypeInput;
