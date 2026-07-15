import { memo } from "react";
import { Link } from "react-router";
import type PortfolioDataType from "../../../models/state-types/PortfolioDataType";
import LazyImage from "../../general/LazyImage";
import Clip from "../../general/Clip";
import styles from "./portfolioDetails.module.css";

interface PortfolioDetailsPropType {
  data: PortfolioDataType;
}

const ArrowIcon = () => (
  <svg
    width="72"
    height="9"
    viewBox="0 0 72 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M71.1906 4.84206C71.3987 4.634 71.3987 4.29667 71.1906 4.08861L67.8001 0.698088C67.592 0.490029 67.2547 0.490029 67.0466 0.698088C66.8386 0.906148 66.8386 1.24348 67.0466 1.45154L70.0604 4.46534L67.0466 7.47914C66.8386 7.6872 66.8386 8.02453 67.0466 8.23259C67.2547 8.44065 67.592 8.44065 67.8001 8.23259L71.1906 4.84206ZM0.488281 4.9981L70.8139 4.99811L70.8139 3.93257L0.488281 3.93256L0.488281 4.9981Z"
      fill="currentColor"
    />
  </svg>
);

const PortfolioDetails: React.FC<PortfolioDetailsPropType> = ({ data }) => {
  return (
    <section id="portfolio_details_section" className={styles.section}>
      <div className="container">
        <Link
          to="/portfolios"
          className={`color_static ${styles.back_link}`}
          style={{ color: data.projectText }}
        >
          <span className={styles.back_link_arrow}>
            <ArrowIcon />
          </span>
          All projects
        </Link>

        {/* <LazyImage
          src={import.meta.env.VITE_FILES_PATH + data.image}
          alt={data.title}
          aspectRatio="2.35 / 1"
          className={styles.hero_thumb}
          priority
        /> */}

        <div className={styles.meta_row}>
          {data.projectLogo ? (
            <img
              className={styles.project_logo}
              src={import.meta.env.VITE_FILES_PATH + data.projectLogo}
              alt={data.title}
              loading="eager"
              decoding="async"
            />
          ) : (
            <h2 className="color_static" style={{ color: data.projectText }}>
              {data.title}
            </h2>
          )}
          <div className={styles.meta_pills}>
            {data.status && (
              <Clip
                value={data.status}
                clipColor={data.projectText}
                colorTextColor={data.projectColor}
              />
            )}
            {data.companyBuiltWith && (
              <Clip
                value={`Build with ${data.companyBuiltWith} Team`}
                clipColor={data.projectText}
                colorTextColor={data.projectColor}
              />
            )}
          </div>
        </div>

        <div className={styles.body_grid}>
          <div>
            <p
              className={`color_static ${styles.description}`}
              style={{ color: data.projectText }}
            >
              {data.desc}
            </p>
            {data.outcome && (
              <div className={styles.outcome}>
                <h5
                  className="color_static"
                  style={{ color: data.projectText }}
                >
                  Outcome
                </h5>
                <p className="color_static" style={{ color: data.projectText }}>
                  {data.outcome}
                </p>
              </div>
            )}
          </div>
          <div data-pf-skills>
            <h5 className="color_static" style={{ color: data.projectText }}>
              Skills Used
            </h5>
            <div
              className={styles.skills_container}
              style={{ color: data.projectText }}
            >
              {data.skills.map((item, i) => (
                <Clip
                  key={i}
                  value={item}
                  skill
                  clipColor={data.projectText}
                  colorTextColor={data.projectColor}
                />
              ))}
            </div>

            <div className={styles.body_links}>
              {data.link && (
                <a
                  href={data.link}
                  className={`color_static ${styles.visit_link}`}
                  style={{ color: data.projectText }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                  <span
                    className={styles.visit_link_arrow}
                    style={{ color: data.projectText }}
                  >
                    <ArrowIcon />
                  </span>
                </a>
              )}
              {data.moreInfoLink && (
                <a
                  href={data.moreInfoLink}
                  className={`color_static ${styles.more_info_link}`}
                  style={{ color: data.projectText }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More info
                </a>
              )}
            </div>
          </div>
        </div>

        {data.carousel.length > 0 && (
          <div className={styles.gallery} data-pf-gallery>
            {data.carousel.map((item) => (
              <div key={item.id} className={styles.gallery_item}>
                <LazyImage
                  src={import.meta.env.VITE_FILES_PATH + item.img}
                  alt={item.title}
                  aspectRatio="2.35 / 1"
                  className={styles.gallery_thumb}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(PortfolioDetails);
