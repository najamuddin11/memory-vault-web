import React, { type ReactNode } from "react";
import styles from "./custom-button.module.css";

interface CustomButtonPropType {
  text: string | ReactNode;
  type: "submit" | "reset" | "button" | undefined;
  onClick?: () => void;
  className?: string;
}

const CustomButton: React.FC<CustomButtonPropType> = (props) => {
  const { text, type, onClick, className } = props;
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.custom_button} ${className ?? ""}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
