import { memo } from "react";
import styles from "./header.module.css";

interface HeaderPropType {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  img?: string;
  secondary?: boolean;
}

const Header: React.FC<HeaderPropType> = ({
  eyebrow,
  title,
  titleHighlight,
  description,
  img,
  secondary,
}) => {
  return (
    <div className={styles.header_wrapper}>
      <header
        className={`${
          secondary ? styles.secondary_header : styles.header
        } container ${styles.header_container}`}
      >
        <div className={styles.header_leftCol}>
          <h5>{eyebrow}</h5>
          {(title || titleHighlight) && (
            <h1>
              {title}{" "}
              <span style={{ color: "var(--side-theme-color)" }}>
                {titleHighlight}
              </span>
            </h1>
          )}

          {description && <p>{description}</p>}
        </div>
        {!secondary ? (
          <div className={styles.header_rightCol}>
            <div className={styles.header_rightColImg_bg}></div>
            <div
              className={styles.header_rightColImg_wrapper}
              style={{
                backgroundImage: `url(${import.meta.env.VITE_FILES_PATH}${img})`,
              }}
            ></div>
          </div>
        ) : (
          ""
        )}
      </header>
    </div>
  );
};

export default memo(Header);
