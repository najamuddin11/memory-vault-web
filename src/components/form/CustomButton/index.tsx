import React, { type ReactNode } from "react";
import styles from "./custom-button.module.css";

interface CustomButtonPropType {
  text: string | ReactNode;
  type: "submit" | "reset" | "button" | undefined;
}

const CustomButton: React.FC<CustomButtonPropType> = (props) => {
  const { text, type } = props;
  return (
    <button type={type} className={`${styles.custom_button}`}>
      {text}
    </button>
  );
};

export default CustomButton;
