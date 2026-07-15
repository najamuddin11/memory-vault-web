import styles from "./portfolioListCard.module.css";
import type PortfolioDataType from "../../../models/state-types/PortfolioDataType";
import { memo, type CSSProperties } from "react";
import LazyImage from "../../general/LazyImage";
import { Link } from "react-router";

interface PortfolioCardPropType {
  data: PortfolioDataType;
  setRef?: (el: HTMLAnchorElement | null) => void;
  /** grid-column / grid-row placement for this card, computed by the parent. */
  style?: CSSProperties;
  onHoverStart?: () => void;
}

const PortfolioCard: React.FC<PortfolioCardPropType> = ({
  data,
  setRef,
  style,
  onHoverStart,
}) => {
  return (
    <Link
      ref={setRef}
      to={`/portfolios/${data.id}`}
      className={styles.portfolioList_card}
      style={style}
      onMouseEnter={onHoverStart}
      onFocus={onHoverStart}
    >
      {/* aspectRatio="auto" + height 100% lets the image fill whatever
          cell size the grid gives it (fixed per its col/row span) instead
          of forcing a fixed 16/9 box. */}
      <LazyImage
        src={import.meta.env.VITE_FILES_PATH + data.image}
        alt={data.title}
        aspectRatio="auto"
        className={styles.portfolioList_card_thumb}
        imgClassName={styles.portfolioList_card_img}
        style={{ height: "100%" }}
      />
    </Link>
  );
};

export default memo(PortfolioCard);
