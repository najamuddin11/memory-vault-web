import { memo, type ReactNode } from "react";
import styles from "./pageLoader.module.css";

/**
 * The atom everything else is built from - a rounded box with the same
 * moving-gradient sweep LazyImage already uses for its skeleton, so a
 * page-level load and an image-level load read as the same product
 * language rather than two different loading styles.
 */
export const Shimmer: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ width, height, className, style }) => (
  <div
    className={`${styles.shimmer} ${className ?? ""}`}
    style={{ width, height, ...style }}
  />
);

/** Mirrors layout/Header - "primary" (full hero, image column included) or
 * "secondary" (the shorter eyebrow/title/description-only header used on
 * inner pages). Pass whichever variant the real <Header> on the page uses. */
export const HeaderShimmer: React.FC<{ variant?: "primary" | "secondary" }> = ({
  variant = "secondary",
}) => (
  <div
    className={`container ${styles.header_block} ${
      variant === "primary" ? styles.header_block_primary : ""
    }`}
  >
    <div className={styles.header_text_col}>
      <Shimmer className={styles.eyebrow_bar} />
      <Shimmer className={styles.title_bar} />
      <Shimmer className={styles.desc_bar} />
      <Shimmer className={styles.desc_bar_short} />
    </div>
    {variant === "primary" && (
      <div className={styles.header_image_col}>
        <Shimmer className={styles.header_image} />
      </div>
    )}
  </div>
);

/** A row of pill-shaped shimmers - skills lists, tag rows, filters. */
export const ShimmerPills: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className={styles.pill_row}>
    {Array.from({ length: count }).map((_, i) => (
      <Shimmer key={i} className={styles.pill} />
    ))}
  </div>
);

/** A short paragraph's worth of text lines, last one shorter. */
export const ShimmerLines: React.FC<{ lines?: number }> = ({ lines = 2 }) => (
  <div className={styles.lines}>
    {Array.from({ length: lines }).map((_, i) => (
      <Shimmer
        key={i}
        className={i === lines - 1 ? styles.line_short : styles.line}
      />
    ))}
  </div>
);

/**
 * A generic responsive card grid - reusable for anything laid out as N
 * same-ish tiles: the portfolio bento grid, a services row, work
 * experience cards, etc. Doesn't try to pixel-match any one page's exact
 * grid math (that lives in the real component's CSS) - just holds the
 * page's shape while data loads.
 */
export const ShimmerCardGrid: React.FC<{
  count?: number;
  minWidth?: string;
  aspectRatio?: string;
}> = ({ count = 6, minWidth = "220px", aspectRatio = "4 / 3" }) => (
  <div
    className={styles.card_grid}
    style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))` }}
  >
    {Array.from({ length: count }).map((_, i) => (
      <Shimmer key={i} style={{ aspectRatio }} />
    ))}
  </div>
);

interface PageLoaderPropType {
  /** Which Header shape to show up top. Pass false to skip the header
   * shimmer entirely (e.g. a loader used inside an already-loaded page). */
  header?: "primary" | "secondary" | false;
  /** The page's own content shimmer, composed from the pieces above (or
   * anything else) - this is what makes PageLoader generic instead of
   * baking one fixed page shape into the component itself. */
  children?: ReactNode;
}

const PageLoader: React.FC<PageLoaderPropType> = ({
  header = "secondary",
  children,
}) => (
  <div className={styles.page_loader}>
    {header && <HeaderShimmer variant={header} />}
    {children && <div className="container">{children}</div>}
  </div>
);

export default memo(PageLoader);
