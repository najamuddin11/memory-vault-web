import { memo } from "react";
import styles from "./errorState.module.css";
import CustomButton from "../../form/CustomButton";

interface ErrorStatePropType {
  /** "error" (something failed) vs "notFound" (nothing here) - swaps the
   * illustration accent and default copy. */
  variant?: "error" | "notFound";
  title?: string;
  description?: string;
  /** Shown as a small monospace-ish detail line under the description,
   * e.g. the raw error message. Optional, dev-facing. */
  detail?: string;
  /** Pass to show a "Try again" button that re-runs whatever failed. */
  onRetry?: () => void;
  retryLabel?: string;
}

const DEFAULT_COPY: Record<
  NonNullable<ErrorStatePropType["variant"]>,
  { title: string; description: string; glyph: string }
> = {
  error: {
    title: "Something went wrong",
    description:
      "That didn't load the way it was supposed to. It's likely a temporary hiccup - give it another try in a moment.",
    glyph: "!",
  },
  notFound: {
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist, or it may have moved.",
    glyph: "?",
  },
};

/**
 * Beauty here comes from reusing the brand's own visual language rather
 * than a generic "sad face" illustration: the rotated dual-card motif from
 * the secondary Header, the same brand purple, the same arrow glyph used
 * on "Visit Website" / "See all projects" links elsewhere in the app.
 */
const ErrorState: React.FC<ErrorStatePropType> = ({
  variant = "error",
  title,
  description,
  detail,
  onRetry,
  retryLabel = "Try again",
}) => {
  const copy = DEFAULT_COPY[variant];

  return (
    <div className={styles.error_wrapper}>
      <div className={`container ${styles.error_container}`}>
        <div className={styles.error_art}>
          <div className={styles.error_art_bg} />
          <div className={styles.error_art_card}>
            <span className={styles.error_art_glyph}>{copy.glyph}</span>
          </div>
        </div>
        <h5 className="color_static">
          {variant === "notFound" ? "404" : "ERROR"}
        </h5>
        <h2>{title ?? copy.title}</h2>
        <p className={styles.error_description}>
          {description ?? copy.description}
        </p>
        {detail && <p className={styles.error_detail}>{detail}</p>}

        <div className={styles.error_actions}>
          <div>
            {onRetry && (
              <CustomButton
                type="button"
                text={retryLabel}
                onClick={onRetry}
                className={styles.error_retry_button}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ErrorState);
