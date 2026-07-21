import { useEffect, useRef } from "react";

const Cursor = () => {
  const cursorDotOutline = useRef<HTMLDivElement | null>(null);
  const cursorDot = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const endX = useRef(0);
  const endY = useRef(0);

  const cursorVisible = useRef(false);
  const cursorEnlarged = useRef(false);

  /** Mouse Handlers */
  const onMouseMove = (event: MouseEvent) => {
    endX.current = event.clientX;
    endY.current = event.clientY;

    const dot = cursorDot.current;
    if (dot) {
      dot.style.top = `${endY.current}px`;
      dot.style.left = `${endX.current}px`;
    }

    if (!cursorVisible.current) {
      cursorVisible.current = true;
      toggleCursorVisibility();
    }
  };

  const onMouseEnter = () => {
    cursorVisible.current = true;
    toggleCursorVisibility();
  };

  const onMouseLeave = () => {
    cursorVisible.current = false;
    toggleCursorVisibility();
  };

  const onMouseDown = () => {
    cursorEnlarged.current = true;
    updateCursorState();
  };

  const onMouseUp = () => {
    cursorEnlarged.current = false;
    updateCursorState();
  };

  /** Visibility */
  const toggleCursorVisibility = () => {
    const opacity = cursorVisible.current ? "1" : "0";
    cursorDot.current && (cursorDot.current.style.opacity = opacity);
    cursorDotOutline.current &&
      (cursorDotOutline.current.style.opacity = opacity);
  };

  /** Update Size & Color */
  const updateCursorState = () => {
    const dot = cursorDot.current;
    const outline = cursorDotOutline.current;
    if (!dot || !outline) return;

    if (cursorEnlarged.current) {
      dot.style.transform = "translate(-50%, -50%) scale(0.7)";
      outline.style.transform = "translate(-50%, -50%) scale(3)";
      outline.style.backgroundColor = "rgba(0,0,0,0.25)";
    } else {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.transform = "translate(-50%, -50%) scale(1)";
      outline.style.backgroundColor = "rgba(126,116,241,0.25)";
    }
  };

  /** Delegated Hover Handling */
  const handleDelegatedHovers = () => {
    const selector = "a, button, .hover_size, .hover_color";

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(selector)) {
        cursorEnlarged.current = true;
        updateCursorState();
      }
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(selector)) {
        cursorEnlarged.current = false;
        updateCursorState();
      }
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  };

  /** Animation Loop */
  const animateDotOutline = () => {
    mouseX.current += (endX.current - mouseX.current) / 8;
    mouseY.current += (endY.current - mouseY.current) / 8;

    const outline = cursorDotOutline.current;
    if (outline) {
      outline.style.top = `${mouseY.current}px`;
      outline.style.left = `${mouseX.current}px`;
    }

    requestRef.current = requestAnimationFrame(animateDotOutline);
  };

  /** Mount */
  useEffect(() => {
    if (typeof window === "undefined") return;

    endX.current = window.innerWidth / 2;
    endY.current = window.innerHeight / 2;

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    const cleanupHovers = handleDelegatedHovers();

    // Cancel old RAF if exists
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animateDotOutline);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      cleanupHovers();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorDotOutline} id="cursor-dot-outline" />
      <div ref={cursorDot} id="cursor-dot" />
    </>
  );
};

export default Cursor;
