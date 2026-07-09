import React from "react";
import styles from "./error.module.css";

interface InputErrorPropType {
  msg: string;
}

const InputError: React.FC<InputErrorPropType> = (props) => {
  const { msg } = props;
  return <div className={`${styles.error_msg}`}>{msg}</div>;
};

export default InputError;
