import { useQuery } from "@tanstack/react-query";
import { fetchPortfolios } from "../api/portfolioApi";

/**
 * Fetches just the portfolio list (portfolio query) - PortfoliosPage only
 * ever needs this slice of homeData, so it doesn't need to pull (or wait
 * on) intro/services/experience/education/contact data just to render.
 */
export const usePortfolios = () =>
  useQuery({
    queryKey: ["portfolios"],
    queryFn: fetchPortfolios,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
