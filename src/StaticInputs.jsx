/* eslint-disable react/prop-types */
import { useState } from "react";
import MultiTypeInputNew from "./MultiTypeInputNew";
import { staticPropsSchema } from "./schemas";

const StaticInputs = ({ jsonData, handleStaticInputChange }) => {
	const [errors, setErrors] = useState({});
	const schemaFields = staticPropsSchema.fields;
	const submitHandler = (e) => {
		e.preventDefault();
		staticPropsSchema
			.validate(jsonData, { abortEarly: false })
			.then((blez) => {
				console.log("--------values---------");
				console.log(blez);
				setErrors({});
			})
			.catch((err) => {
				setErrors({});
				err.inner.forEach((error) => {
					setErrors((prevErrors) => ({
						...prevErrors,
						[error.path]: error.message,
					}));
				});
			});
	};
	return (
		<form onSubmit={submitHandler} className="static_component_container">
			{Object.keys(schemaFields).map((fieldKey) => {
				const fieldDesc = schemaFields[fieldKey].describe();
				const { type, placeholder, disabled } = fieldDesc.meta.inputProps;
				const label = fieldDesc.label;
				// const defaultValue = fieldDesc.default;
				const options = fieldDesc.oneOf;
				return (
					<MultiTypeInputNew
						key={fieldKey}
						name={fieldKey}
						onChange={handleStaticInputChange}
						type={type}
						label={label}
						options={options}
						value={jsonData[fieldKey]}
						error={errors[fieldKey]}
						disabled={disabled}
						placeholder={placeholder}
					/>
				);
			})}
			<button className="button btn-green" type="submit">
				Validate
			</button>
		</form>
	);
};

export default StaticInputs;
