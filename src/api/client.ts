import { GraphQLClient } from "graphql-request";

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL;
export const API_BASE_URL = GRAPHQL_URL.replace(/\/graphql\/?$/, "");

const graphqlClient = new GraphQLClient(GRAPHQL_URL, {
  credentials: "include",
});

export default graphqlClient;
