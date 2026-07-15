import React, { useLayoutEffect, useRef, useCallback, memo } from "react";
import styles from "./services.module.css";
import Card from "./ServiceCard";
import type ServiceDataType from "../../../models/state-types/ServiceDataType";
import gsap from "gsap";
import useWindowSize from "../../../hooks/useWindowSize";

interface ServicesPropType {
  services?: ServiceDataType[];
}

const Services: React.FC<ServicesPropType> = ({ services }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const headingRef1 = useRef<HTMLHeadingElement>(null);
  const headingRef2 = useRef<HTMLHeadingElement>(null);
  const windowWidth = useWindowSize();
  const isMobile = windowWidth <= 768;

  // Stable per-index callback refs so Card's memo() isn't defeated by a
  // freshly-created inline function on every Services re-render.
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
    if (!services?.length) return;

    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.from([headingRef1.current, headingRef2.current], {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef1.current,
            start: "top 80%",
            toggleActions: "play pause resume reset",
          },
        });

        cardRefs.current.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play pause resume reset",
              },
            },
          );
        });
      } else {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 5%",
            end: `+=${containerRef.current?.offsetHeight}`,
            scrub: true,
            pin: true,
          },
        });

        tl.from(headingRef1.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });

        tl.from(
          headingRef2.current,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.4",
        );

        cardRefs.current.forEach((card) => {
          tl.fromTo(
            card,
            { opacity: 0, x: 100 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [services, windowWidth]);

  return (
    <section id="services" className="bg_secondary">
      <div
        className={`container ${styles.service_section_container}`}
        ref={containerRef}
      >
        <div className="text_center">
          <h5 ref={headingRef1}>services</h5>
          <h2 ref={headingRef2}>Specialized in</h2>
        </div>

        <div className={styles.service_card_container}>
          {services?.map((item, index) => (
            <Card key={item.id} data={item} setRef={getCardRef(index)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Services);
