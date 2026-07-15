import { memo, useState } from "react";
import styles from "./lazyImage.module.css";

interface LazyImagePropType {
  src: string;
  alt: string;
  /**
   * e.g. "4 / 3", "16 / 9", "1 / 1", "auto". Reserves layout space so
   * nothing shifts once the image loads.
   *
   * Left unset on purpose - there is NO default here. Forcing a default
   * ratio (e.g. always "4 / 3") is what breaks callers that need the box
   * to be driven by something else (a CSS grid cell, a masonry/gallery
   * layout, an intrinsic image ratio, etc). Every consumer should decide
   * this explicitly:
   *  - Fixed-ratio tiles (cards, thumbnails): pass a ratio like "4 / 3".
   *  - Cell size already comes from a CSS Grid track (e.g. an explicit
   *    grid-row/grid-column span): pass aspectRatio="auto" AND a style/
   *    className that gives the wrapper a concrete height (100% of the
   *    grid cell, a fixed px value, etc). "auto" alone with no height
   *    source will collapse to 0px, since the wrapper has nothing to
   *    measure against.
   */
  aspectRatio?: string;
  /** How the image should fill its box. Defaults to "cover" (crop to fill,
   * good for thumbnails/tiles). Use "contain" for logos or images that must
   * never be cropped. */
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  /** Above-the-fold images (first row of a grid, hero images) should be priority=true so they start
   * fetching immediately instead of waiting for lazy-load, which is what causes the "appears late" effect. */
  priority?: boolean;
  /** Extra class(es) for the wrapper div - use this to size/position the
   * component per-context (grid cell height, aspect-ratio override, border
   * radius, etc) instead of reaching into the component's own styles. */
  className?: string;
  /** Extra class(es) for the underlying <img>. */
  imgClassName?: string;
  style?: React.CSSProperties;
}

const LazyImage: React.FC<LazyImagePropType> = (props) => {
  const {
    src,
    alt,
    aspectRatio,
    objectFit = "cover",
    priority = false,
    className,
    imgClassName,
    style,
  } = props;
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`${styles.lazy_image_wrapper} ${className ?? ""}`}
      style={{ ...(aspectRatio ? { aspectRatio } : {}), ...style }}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        style={{ objectFit }}
        className={`${styles.lazy_image} ${loaded ? styles.lazy_image_loaded : ""} ${imgClassName ?? ""}`}
      />
    </div>
  );
};

export default memo(LazyImage);
