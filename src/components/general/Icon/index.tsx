import { memo } from "react";
import styles from "./icon.module.css";
import { themeMode } from "../../../models/state-types/ThemeModeType";
import { useTheme } from "../../../context/ThemeContext";

interface IconPropType {
  source: {
    iconDark: string;
    iconLight: string;
  };
  text: string;
  center?: boolean;
}

const Icon: React.FC<IconPropType> = ({ source, text, center }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`hover_size ${styles.icon_container} ${
        center ? styles.icon_centered : ""
      }`}
    >
      <img
        src={theme === themeMode.dark ? source.iconDark : source.iconLight}
        alt={text}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

export default memo(Icon);
