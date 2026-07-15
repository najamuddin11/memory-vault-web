import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioById } from "../api/portfolioApi";

export const usePortfolioById = (id: string | undefined) =>
  useQuery({
    queryKey: ["portfolioById", id],
    queryFn: () => fetchPortfolioById(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
