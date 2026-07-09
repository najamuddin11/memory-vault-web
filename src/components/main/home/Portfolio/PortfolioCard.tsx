import styles from "./portfolioCard.module.css";
import type PortfolioDataType from "../../../../models/state-types/PortfolioDataType";
import Clip from "../../../general/Clip";
import { memo } from "react";

interface PortfolioCardPropType {
  data: PortfolioDataType;
  setRef?: (el: HTMLDivElement | null) => void;
}

const PortfolioCard: React.FC<PortfolioCardPropType> = (props) => {
  const { data, setRef } = props;

  return (
    <div ref={setRef} className={styles.portfolio_card}>
      <div>
        <div className={styles.portfolio_card_title} data-pf-title>
          {data.projectLogo ? (
            <img
              className={styles.portfolio_card_project_logo}
              src={import.meta.env.VITE_FILES_PATH + data?.projectLogo}
              alt={data.title}
              loading="lazy"
              decoding="async"
            />
          ) : (
            data.title
          )}
        </div>
        <div className={styles.portfolio_card_innerContainer}>
          <p
            className="color_static"
            style={{ color: data.projectText }}
            data-pf-desc
          >
            {data.desc}
          </p>
          {/* {data.outcome && (
          <div className={styles.portfolio_card_outcome}>
            <div data-pf-outcome>
              <h5 style={{ color: data.projectText }}>Outcome</h5>
              <p style={{ color: data.projectText }}>{data.outcome}</p>
            </div>
          </div>
        )} */}
          <div className={styles.portfolio_card_skills_gallery_container}>
            <div data-pf-skills>
              <h5 style={{ color: data.projectText }}>Skills Used</h5>
              <div
                style={{ color: data.projectText }}
                className={styles.skills_clip_container}
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
              <div>
                <div style={{ marginTop: "40px", color: data.projectText }}>
                  {data.link && (
                    <a
                      href={data.link}
                      className={styles.portfolio_card_visitWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                      <div className={styles.portfolio_card_visitWebsite_arrow}>
                        <svg
                          width="72"
                          height="9"
                          viewBox="0 0 72 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            id="arrow"
                            d="M71.1906 4.84206C71.3987 4.634 71.3987 4.29667 71.1906 4.08861L67.8001 0.698088C67.592 0.490029 67.2547 0.490029 67.0466 0.698088C66.8386 0.906148 66.8386 1.24348 67.0466 1.45154L70.0604 4.46534L67.0466 7.47914C66.8386 7.6872 66.8386 8.02453 67.0466 8.23259C67.2547 8.44065 67.592 8.44065 67.8001 8.23259L71.1906 4.84206ZM0.488281 4.9981L70.8139 4.99811L70.8139 3.93257L0.488281 3.93256L0.488281 4.9981Z"
                            fill={data.projectText}
                          />
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.portfolio_card_gallery} data-pf-gallery>
              {data.carousel.map((item) => (
                <div key={item.id}>
                  <img
                    src={import.meta.env.VITE_FILES_PATH + item.img}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PortfolioCard);
