import React from "react";
import styles from "./loader.module.css";

interface LoaderPropType {
  /** Diameter, any valid CSS length. Defaults to a small inline spinner size. */
  size?: string;
  /** Centers the spinner in a full-width row - use for a lazy chunk /
   * Suspense fallback, a panel, or anywhere the loader is the only thing
   * in its container. Leave off to drop it inline (e.g. inside a button). */
  center?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderPropType> = (props) => {
  const { size = "28px", center = false, className } = props;

  const spinner = (
    <div
      style={{ height: size, width: size }}
      className={`${styles.loader} ${className ?? ""}`}
    />
  );

  if (!center) return spinner;

  return <div className={styles.loader_center}>{spinner}</div>;
};

export default Loader;
