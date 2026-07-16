import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./work-experience.module.css";
import CompanyName from "./CompanyName";
import CompanyDetails from "./CompanyDetails";
import useWindowSize from "../../../hooks/useWindowSize";
import type WorkExperienceDataType from "../../../models/state-types/WorkExperienceDataType";
import gsap from "gsap";

interface WorkExperiencePropType {
  experience?: WorkExperienceDataType[];
}

const WorkExperience: React.FC<WorkExperiencePropType> = (props) => {
  const { experience } = props;
  const [activeItem, setActiveItem] = useState<WorkExperienceDataType | null>(
    null,
  );
  const windowWidth = useWindowSize();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    props?.experience && setActiveItem(props?.experience[0]);
  }, [props]);
  useLayoutEffect(() => {
    if (!experience || experience.length === 0) return;
    if (!containerRef.current) return;

    const isDesktop = window.innerWidth >= 1024;

    const heading1El = containerRef.current.querySelector("[data-we-heading1]");
    const heading2El = containerRef.current.querySelector("[data-we-heading2]");
    const companyNamesEl = containerRef.current.querySelector(
      "[data-we-companynames]",
    );
    const companyDetailsEl = containerRef.current.querySelector(
      "[data-we-companydetails]",
    );

    const calEl = containerRef.current.querySelector(
      "[data-we-cal]",
    ) as HTMLElement;

    const ctx = gsap.context(() => {
      if (isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: !isDesktop ? "top 10%" : "top 5%",
            end: `+=${
              containerRef.current && containerRef.current.offsetHeight + 1000
            }`,
            scrub: isDesktop, // Disable scrub on mobile
            pin: isDesktop, // Disable pin on mobile
          },
        });

        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(companyNamesEl, { y: 50, opacity: 0, duration: 1 }, "-=0.4")
          .from(
            companyDetailsEl,
            { y: 50, opacity: 0, duration: 0.6 },
            "-=0.4",
          );

        // Only add the scroll-triggered company changes on desktop
        let currentIndex = 0;
        experience.forEach((_, index) => {
          if (index === 0) return;

          // Calculate progress % based on index
          let progress = (index / (experience.length - 1)) * 100;
          tl.to(
            calEl,
            {
              height: `${progress}%`,
              duration: 1,
              ease: "none",
            },
            `+=1.2`,
          ).to(
            {},
            {
              duration: 1,
              onStart: () => {
                currentIndex = index;
                if (experience && experience[currentIndex]) {
                  setActiveItem(experience[currentIndex]);
                }
              },
              onReverseComplete: () => {
                currentIndex = Math.max(0, index - 1);
                if (experience && experience[currentIndex]) {
                  setActiveItem(experience[currentIndex]);
                }
              },
            },
            "<", // run at the same time as height animation
          );
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play pause resume reset", // Changed this line
          },
        });

        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(companyNamesEl, { y: 50, opacity: 0, duration: 1 }, "-=0.4")
          .from(
            companyDetailsEl,
            { y: 50, opacity: 0, duration: 0.6 },
            "-=0.4",
          );
        // ELSE BLOCK: Progress bar increases with scroll progress but activeItem doesn't change automatically

        // Create a separate scroll-triggered animation just for the progress bar
        tl.to(calEl, {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });

        experience.forEach((item) => {
          const companyNameEl = containerRef.current?.querySelector(
            `[data-companyname-id="${item.id}"]`,
          );

          if (companyNameEl) {
            tl.to(companyNameEl, {
              scrollTrigger: {
                trigger: companyNameEl,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveItem(item),
                onEnterBack: () => setActiveItem(item),
              },
            });
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [experience, windowWidth]);

  // Add this new effect for state change animations
  useLayoutEffect(() => {
    if (!activeItem) return;

    const companyDetailsEl =
      containerRef.current?.querySelector("[data-we-x] > div");

    if (!companyDetailsEl) return;

    const ctx = gsap.context(() => {
      // Animate the details container when activeItem changes
      gsap.fromTo(
        companyDetailsEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeItem]);

  return (
    <section id="work" className="bg_secondary_gradient_effect">
      <div className="container" ref={containerRef}>
        <div className={`${styles.work_experience_container}`}>
          <div className={`${styles.work_experience_left_col}`}>
            <h5 data-we-heading1>Career path</h5>
            <h2 data-we-heading2>Work Experiences</h2>
            <div
              className={`${styles.work_experience_title_container}`}
              data-we-companynames
            >
              <div
                data-we-cal
                className={`${styles.work_experience_cal}`}
              ></div>
              {experience?.map((item) => (
                <CompanyName
                  item={item}
                  key={item.id}
                  size={windowWidth}
                  setActiveItem={setActiveItem}
                  activeItem={activeItem}
                />
              ))}
            </div>
          </div>
          {windowWidth > 1023 && (
            <div data-we-companydetails>
              <CompanyDetails item={activeItem} />{" "}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(WorkExperience);
