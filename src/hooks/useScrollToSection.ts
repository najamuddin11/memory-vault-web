import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

type ScrollToSection = (
  sectionId: string,
  options?: {
    path?: string;
    offset?: number;
  },
) => void;

export const useScrollToSection = (defaultOffset = 80): ScrollToSection => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (sectionId, options = {}) => {
      const { path = "/", offset = defaultOffset } = options;

      // If we're on another page, navigate to /#section
      if (location.pathname !== path) {
        navigate(`${path}#${sectionId}`);
        return;
      }

      // Already on the correct page
      const element = document.getElementById(sectionId);

      if (!element) return;

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - offset,
        behavior: "smooth",
      });
    },
    [defaultOffset, location.pathname, navigate],
  );
};
