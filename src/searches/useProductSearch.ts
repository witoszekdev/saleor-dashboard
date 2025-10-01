// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchProductsDocument,
  SearchProductsQuery,
  SearchProductsQueryVariables,
} from "@dashboard/graphql";

import { makeTopLevelSearch } from "../hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchProducts = gql`
  query SearchProducts(
    $after: String
    $first: Int!
    $query: String!
    $channel: String
    $where: ProductWhereInput
  ) {
    search: products(
      after: $after
      first: $first
      search: $query
      channel: $channel
      where: $where
    ) {
      edges {
        node {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const UseProductSearch = makeTopLevelSearch<
  SearchProductsQuery,
  SearchProductsQueryVariables
>(SearchProductsDocument);
