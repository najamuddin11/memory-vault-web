import { memo } from "react";
import styles from "./header.module.css";
import ParticleLayout from "../ParticleLayout";
import type IntroDataType from "../../../models/state-types/IntroDataType";

interface HeaderPropType {
  intro?: IntroDataType;
}
const Header: React.FC<HeaderPropType> = ({ intro }) => {
  return (
    <div className={styles.header_wrapper}>
      <ParticleLayout>
        <header
          className={`${styles.header} container ${styles.header_container}`}
        >
          <div className={styles.header_leftCol}>
            <h5>MY NAME IS</h5>
            <h1>
              {intro?.firstName}{" "}
              <span style={{ color: "var(--side-theme-color)" }}>
                {intro?.lastName}
              </span>
            </h1>
            <p>{intro?.summary}</p>
          </div>

          <div className={styles.header_rightCol}>
            <div className={styles.header_rightColImg_bg}></div>
            <div
              className={styles.header_rightColImg_wrapper}
              style={{
                backgroundImage: `url(${import.meta.env.VITE_FILES_PATH}${intro?.img})`,
              }}
            ></div>
          </div>
        </header>
      </ParticleLayout>
    </div>
  );
};

export default memo(Header);
