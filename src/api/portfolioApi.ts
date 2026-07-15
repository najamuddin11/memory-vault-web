import graphqlClient from "./client";
import { PORTFOLIO_BY_ID_QUERY, PORTFOLIOS_QUERY } from "../graphql/queries";
import type PortfolioDataType from "../models/state-types/PortfolioDataType";

// Same reasoning as homeApi.ts's toNumber: GraphQL `ID` fields come back as
// strings, the rest of the app expects numbers.
const toNumber = (value: unknown): number => Number(value);

type RawPortfolio = Record<string, unknown> & {
  id: string;
  carousel: Array<Record<string, unknown> & { id: string }>;
};

const normalizePortfolio = (raw: RawPortfolio): PortfolioDataType =>
  ({
    ...raw,
    id: toNumber(raw.id),
    carousel: raw.carousel.map((c) => ({ ...c, id: toNumber(c.id) })),
  }) as PortfolioDataType;

interface GraphQLPortfolioByIdResponse {
  portfolioById: RawPortfolio | null;
}

export const fetchPortfolioById = async (
  id: string,
): Promise<PortfolioDataType | null> => {
  const { portfolioById } =
    await graphqlClient.request<GraphQLPortfolioByIdResponse>(
      PORTFOLIO_BY_ID_QUERY,
      { portfolioByIdId: id },
    );

  if (!portfolioById) return null;

  return normalizePortfolio(portfolioById);
};

interface GraphQLPortfoliosResponse {
  portfolio: RawPortfolio[];
}

export const fetchPortfolios = async (): Promise<PortfolioDataType[]> => {
  const { portfolio } =
    await graphqlClient.request<GraphQLPortfoliosResponse>(PORTFOLIOS_QUERY);

  return portfolio.map(normalizePortfolio);
};
