import styles from "./clip.module.css";

interface ClipPropType {
  value: string;
  skill?: boolean;
  clipColor?: string;
  colorTextColor?: string;
}

const Clip: React.FC<ClipPropType> = (props) => {
  const { value, skill, clipColor, colorTextColor } = props;

  return (
    <div className={`hover_size ${skill && styles.skills_hover}`}>
      <div
        className={`${styles.clip}`}
        style={{ backgroundColor: clipColor, border: `1px solid ${clipColor}` }}
      >
        <p className={`${styles.clip_text}`} style={{ color: colorTextColor }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default Clip;
