/* eslint-disable react/prop-types */
const MultiTypeInput = ({
	keyName,
	parent,
	data,
	onChangeHandler,
	showLabel = true,
	disabled = false,
}) => {
	return (
		<div>
			<label>
				{showLabel && keyName}
				{Array.isArray(parent[keyName]) && (
					<select className="myComboBox"
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
				)}

				{!Array.isArray(parent[keyName]) && (
					<input className="myinput"
						type={typeof parent[keyName] === "boolean" ? "checkbox" : "text"}
						name={keyName}
						value={data[keyName] === undefined ? "" : data[keyName]}
						checked={
							typeof data[keyName] === "boolean" ? data[keyName] : undefined
						}
						onChange={onChangeHandler}
						disabled={disabled}
					/>
				)}
			</label>
		</div>
	);
};

export default MultiTypeInput;
