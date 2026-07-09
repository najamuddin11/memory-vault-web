import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

/**
 * Tracks window width, debounced so components using it (many of which
 * rebuild GSAP ScrollTrigger timelines on change) don't re-run on every
 * single pixel of a resize drag - only once the user pauses resizing.
 */
function useWindowSize(delay = 200): number {
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      setWindowWidth(window.innerWidth);
    }, delay);

    window.addEventListener("resize", handleResize);
    return () => {
      handleResize.cancel();
      window.removeEventListener("resize", handleResize);
    };
  }, [delay]);

  return windowWidth;
}

export default useWindowSize;
