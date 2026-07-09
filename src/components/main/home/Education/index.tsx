import React, { useLayoutEffect, useRef } from "react";
import styles from "./education.module.css";
import Clip from "../../../general/Clip";
import type EducationDataType from "../../../../models/state-types/EducationDataType";
import type SkillsDataType from "../../../../models/state-types/SkillsDataType";
import gsap from "gsap";
import useWindowSize from "../../../../hooks/useWindowSize";

interface EducationPropType {
  education?: EducationDataType[];
  skills?: SkillsDataType[];
}

const Education: React.FC<EducationPropType> = (props) => {
  const { education, skills } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const educationRefs = useRef<(HTMLDivElement | null)[]>([]);

  const windowWidth = useWindowSize();

  const isDesktop = windowWidth >= 1024;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const heading1El = containerRef.current.querySelector(
      "[data-edu-heading1]"
    );
    const heading2El = containerRef.current.querySelector(
      "[data-edu-heading2]"
    );
    const calEl = containerRef.current.querySelector(
      "[data-edu-cal]"
    ) as HTMLElement;
    const details = containerRef.current.querySelector(
      "[data-edu-details]"
    ) as HTMLElement;
    const skills = containerRef.current.querySelector(
      "[data-edu-skills]"
    ) as HTMLElement;
    const ctx = gsap.context(() => {
      if (!isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play pause resume reset",
          },
        });
        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 })
          .from([details, calEl], {
            y: 50,
            opacity: 0,
            duration: 0.6,
          });

        tl.to(calEl, {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: details,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        });

        education?.forEach((item, index) => {
          const companyNameEl = containerRef.current?.querySelector(
            `[data-educationname-id="${item.id}"]`
          );
          if (companyNameEl) {
            if (index === 0) {
              companyNameEl.classList.add(styles.active);
            } else {
              tl.to(companyNameEl, {
                scrollTrigger: {
                  trigger: companyNameEl,
                  start: "top center",
                  end: "bottom center",
                  onEnter: () => companyNameEl.classList.add(styles.active),
                  onEnterBack: () =>
                    companyNameEl.classList.remove(styles.active),
                },
              });
            }
          }
        });
        tl.from(skills, {
          y: 50,
          opacity: 0,
          duration: 0.6,
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: `+=${containerRef.current?.offsetHeight}`,
            scrub: true,
            pin: true,
          },
        });

        tl.from(heading1El, { y: 50, opacity: 0, duration: 0.6 })
          .from(heading2El, { y: 50, opacity: 0, duration: 0.6 })
          .from(details, {
            y: 50,
            opacity: 0,
            duration: 0.6,
          })
          .from(skills, {
            y: 50,
            opacity: 0,
            duration: 0.6,
          });

        let currentIndex = 0;
        educationRefs.current[currentIndex]?.classList.add(styles.active);
        education?.forEach((_, index) => {
          if (index === 0) return;
          // Calculate progress % based on index
          let progress = (index / (education.length - 1)) * 100;
          console.log(progress);
          tl.to(
            calEl,
            {
              height: `${progress}%`,
              duration: 0.6,
              ease: "none",
            },
            `+=1.2`
          ).to(
            {},
            {
              duration: 1,
              onStart: () => {
                currentIndex = index;
                if (education && education[currentIndex]) {
                  educationRefs.current[currentIndex]?.classList.add(
                    styles.active
                  );
                }
              },
              onReverseComplete: () => {
                currentIndex = index;
                if (education && education[currentIndex]) {
                  educationRefs.current[currentIndex]?.classList.remove(
                    styles.active
                  );
                }
              },
            },
            "<" // run at the same time as height animation
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [education, windowWidth]);
  return (
    <section id="education" ref={containerRef}>
      <div className="container">
        <h5 data-edu-heading1>learning path</h5>
        <h2 data-edu-heading2>Education & Skills</h2>
        <div className={`${styles.education_row}`}>
          <div className={`${styles.education_left_column}`}>
            <div data-edu-cal className={`${styles.education_cal}`}></div>
            <div
              data-edu-details
              className={`${styles.education_details_container}`}
            >
              {education?.map((item, index) => (
                <div
                  data-educationname-id={item.id}
                  className={`${styles.education_details}`}
                  key={item.id}
                  ref={(el) => {
                    educationRefs.current[index] = el;
                  }}
                >
                  <h3 className={`${styles.education_title}`}>
                    {item.academy}
                  </h3>
                  <p className={`${styles.education_content}`}>{item.degree}</p>
                  <h6 style={{ color: "var(--text-primary)" }}>
                    {item.duration}
                  </h6>
                </div>
              ))}
            </div>
          </div>
          <div data-edu-skills className={`${styles.education_right_column}`}>
            <p>
              For {new Date().getFullYear() - new Date("2021").getFullYear()}+
              years, I have been continuously learning in the field of front-end
              and experimenting with new technologies and frameworks, and here
              you can see a summary of my skills.
            </p>
            <div className={`${styles.educarion_clip_container}`}>
              {skills?.map((item) => (
                <Clip value={item.title} key={item.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
