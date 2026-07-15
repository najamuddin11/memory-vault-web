import React, { memo, useCallback, useLayoutEffect, useRef } from "react";
import styles from "./portfolio.module.css";
import { Link } from "react-router";
import type PortfolioDataType from "../../../models/state-types/PortfolioDataType";
import gsap from "gsap";
import PortfolioCard from "./PortfolioCard";
import useWindowSize from "../../../hooks/useWindowSize";

interface PortfolioPropType {
  portfolio: PortfolioDataType[] | undefined;
}

// ~1 mouse-wheel notch / short trackpad swipe of scroll per timeline "unit".
const PX_PER_UNIT = 140;

const HomePortfolio: React.FC<PortfolioPropType> = (props) => {
  const { portfolio } = props;

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const headingRef1 = useRef<HTMLHeadingElement>(null);
  const headingRef2 = useRef<HTMLHeadingElement>(null);
  const seeAllPortfolio = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<HTMLDivElement[]>([]);

  const windowWidth = useWindowSize();

  const cardRefCallbacks = useRef<
    Map<number, (el: HTMLDivElement | null) => void>
  >(new Map());

  const getCardRef = useCallback((index: number) => {
    let cb = cardRefCallbacks.current.get(index);
    if (!cb) {
      cb = (el: HTMLDivElement | null) => {
        if (el) cardRefs.current[index] = el;
      };
      cardRefCallbacks.current.set(index, cb);
    }
    return cb;
  }, []);

  useLayoutEffect(() => {
    if (!portfolio?.length) return;

    const ctx1 = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef1.current,
          start: "top 40%",
          end: `+=${containerRef1.current?.offsetHeight}`,
          scrub: true,
          pin: true,
        },
      });

      tl.from(headingRef1.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      }).from(
        headingRef2.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      );
    }, containerRef1);

    const ctx2 = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef2.current,
          start: "top 5%",
          // Dynamic: total scroll distance = however long the timeline
          // actually is, once every card/image tween below is added.
          end: () => "+=" + tl.duration() * PX_PER_UNIT,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.from(seeAllPortfolio.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
      });

      cardRefs.current.forEach((card, i) => {
        const titleEl = card.querySelector("[data-pf-title]");
        const descEl = card.querySelector("[data-pf-desc]");
        const outcomeEl = card.querySelector("[data-pf-outcome]");
        const skillsEl = card.querySelector("[data-pf-skills]");
        const galleryImagesContainer = card.querySelector("[data-pf-gallery]");
        const galleryImages = card.querySelectorAll<HTMLDivElement>(
          "[data-pf-gallery] > div",
        );
        const seeAllLinkText =
          containerRef2.current?.querySelector<HTMLDivElement>(
            "#seeAll_link_text",
          ) ?? null;
        const seeAllLinkArrow =
          containerRef2.current?.querySelector<HTMLElement>(
            "#seeAll_link_arrow",
          ) ?? null;

        tl.to(sectionRef.current, {
          backgroundColor: portfolio[i].projectColor,
          duration: 0.8,
          ease: "power2.inOut",
        })
          .to([seeAllLinkText, seeAllLinkArrow], {
            color: portfolio[i].projectText,
            fill: portfolio[i].projectText,
            duration: 0.8,
          })
          .to(card, {
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          })
          .from(titleEl, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          })
          .from(descEl, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          })
          .from(outcomeEl, {
            y: 60,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          });

        if (descEl || outcomeEl) {
          tl.to(
            [descEl, outcomeEl],
            {
              opacity: 0,
              duration: 0.5,
              ease: "power2.inOut",
              display: "none",
            },
            "+=0.2",
          );
        }

        tl.from(skillsEl, {
          y: 60,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        }).from(galleryImagesContainer, {
          y: 50,
          display: "none",
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });

        if (galleryImages.length) {
          galleryImages.forEach((img, j) => {
            // One image per ~1 timeline unit == roughly one scroll notch,
            // thanks to the dynamic `end` above.
            tl.fromTo(
              img,
              { opacity: 0, x: 100, order: j + 3, gridColumn: "span 1" },
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                onStart: () => {
                  galleryImages.forEach((prev, k) => {
                    if (k < j) {
                      gsap.set(prev, {
                        order: k + 2,
                        gridColumn: "span 1",
                        ease: "power2.out",
                      });
                    }
                  });

                  gsap.set(img, {
                    order: 1,
                    gridColumn: "span 2",
                    ease: "power2.out",
                  });
                },
                onReverseComplete: () => {
                  if (j > 0) {
                    gsap.set(galleryImages[j - 1], {
                      order: 1,
                      gridColumn: "span 2",
                      ease: "power2.out",
                    });
                    gsap.set(img, {
                      order: j + 2,
                      gridColumn: "span 1",
                      ease: "power2.out",
                    });
                  }
                },
              },
              "+=0.2",
            );
          });
        }

        tl.to(card, {
          opacity: 0,
          display: "none",
          duration: 0.6,
          ease: "power2.inOut",
        });
      });
    }, containerRef2);
    return () => {
      ctx1.revert();
      ctx2.revert();
    };
  }, [portfolio, windowWidth]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className={`bg_primary ${styles.portfolio_section}`}
    >
      <div className="container" ref={containerRef1}>
        <div className={styles.portfolio_stepper_container}>
          <div>
            <h5 className="color_static" ref={headingRef1}>
              My Works
            </h5>
            <h2 className="color_static" ref={headingRef2}>
              Featured Portfolios
            </h2>
          </div>
        </div>
      </div>

      <div className="container" ref={containerRef2}>
        <div className={styles.seeAll_link_container} ref={seeAllPortfolio}>
          <Link to="/portfolios" className={styles.seeAll_link}>
            <div id="seeAll_link_text">See all projects</div>
            <div className={styles.arrow_img_container}>
              <svg
                width="72"
                height="9"
                viewBox="0 0 72 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  id="seeAll_link_arrow"
                  d="M71.1906 4.84206C71.3987 4.634 71.3987 4.29667 71.1906 4.08861L67.8001 0.698088C67.592 0.490029 67.2547 0.490029 67.0466 0.698088C66.8386 0.906148 66.8386 1.24348 67.0466 1.45154L70.0604 4.46534L67.0466 7.47914C66.8386 7.6872 66.8386 8.02453 67.0466 8.23259C67.2547 8.44065 67.592 8.44065 67.8001 8.23259L71.1906 4.84206ZM0.488281 4.9981L70.8139 4.99811L70.8139 3.93257L0.488281 3.93256L0.488281 4.9981Z"
                />
              </svg>
            </div>
          </Link>
        </div>

        <div className={styles.portfolio_cards_container}>
          {portfolio
            ?.filter((item) => item.featured)
            .map((item, index) => (
              <PortfolioCard
                key={item.id}
                data={item}
                setRef={getCardRef(index)}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default memo(HomePortfolio);
