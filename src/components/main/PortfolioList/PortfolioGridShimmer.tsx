import { memo } from "react";
import { Shimmer } from "../../general/PageLoader";
import styles from "./portfolioGridShimmer.module.css";

// Loosely mirrors PortfolioList's SPAN_PATTERN bento mix (wide/tall tiles)
// so the real grid doesn't visibly "jump" into place once data loads.
const TILES = [
  styles.tile_wide,
  styles.tile,
  styles.tile_tall,
  styles.tile,
  styles.tile_wide_tall,
  styles.tile,
  styles.tile,
  styles.tile_wide,
];

const PortfolioGridShimmer = () => (
  <div className={styles.grid}>
    {TILES.map((tileClass, i) => (
      <Shimmer key={i} className={tileClass} />
    ))}
  </div>
);

export default memo(PortfolioGridShimmer);
