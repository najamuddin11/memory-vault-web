import React from "react";
import InputError from "../InputError";
import styles from "./input-field.module.css";
import type { InputChangeEvent } from "../../../models/component-types/FormControlType";

interface InputFieldPropType {
  type: string;
  placeholder: string;
  handleChange: (e: InputChangeEvent) => void;
  value: string;
  name: string;
  error: string | false;
}

const InputField: React.FC<InputFieldPropType> = (props) => {
  const { type, placeholder, handleChange, value, name, error } = props;
  return (
    <div className="form-control">
      <input
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
        className={`${styles.input_field} ${error && styles.input_field_error}`}
        name={name}
      />
      {error && <InputError msg={error} />}
    </div>
  );
};

export default InputField;
