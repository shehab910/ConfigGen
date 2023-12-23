import PropTypes from "prop-types";
import styles from "./MultiTypeInputNew.module.css";
const MultiTypeInputNew = ({
	type,
	placeholder,
	name,
	value,
	onChange,
	label,
	error,
	disabled,
	showLabel = true,
	options,
}) => {
	const getInput = () => {
		if (type === "select") {
			return (
				<select
					name={name}
					value={value}
					onChange={onChange}
					disabled={disabled}
				>
					<option disabled value="">
						Select {name}
					</option>
					{options.map((item, index) => (
						<option key={index} value={item}>
							{item}
						</option>
					))}
				</select>
			);
		}
		if (type === "checkbox") {
			return (
				<input
					type="checkbox"
					name={name}
					value={value}
					checked={value}
					onChange={onChange}
					disabled={disabled}
				/>
			);
		}
		if (type === "text") {
			return (
				<input
					type="text"
					name={name}
					value={value}
					onChange={onChange}
					disabled={disabled}
					placeholder={placeholder}
					className={error ? styles["err-input"] : ""}
				/>
			);
		}
	};
	return (
		<>
			<div>
				<label>{showLabel && label}</label>
				{getInput()}
				{/* write error if exists */}
			</div>
			{error && <p className={`${styles.error} ${styles.subtext}`}>{error}</p>}
		</>
	);
};

MultiTypeInputNew.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.any.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	showLabel: PropTypes.bool,
	error: PropTypes.string,
	disabled: PropTypes.bool,
	options: PropTypes.arrayOf(PropTypes.string),
};

export default MultiTypeInputNew;
