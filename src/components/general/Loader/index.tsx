import React from "react";
import styles from "./loader.module.css";

interface LoaderPropType {
  size: string
}

const Loader: React.FC<LoaderPropType> = (props) => {
  const { size } = props;
  return (
    <div
      style={{ height: size, width: size }}
      className={`${styles.loader}`}
    ></div>
  );
};

export default Loader;
