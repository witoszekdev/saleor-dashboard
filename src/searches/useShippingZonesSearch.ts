// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchShippingZonesDocument,
  SearchShippingZonesQuery,
  SearchShippingZonesQueryVariables,
} from "@dashboard/graphql";
import { makeTopLevelSearch } from "../hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchShippingZones = gql`
  query SearchShippingZones(
    $query: String!
    $first: Int!
    $after: String
    $last: Int
    $before: String
  ) {
    search: shippingZones(
      filter: { search: $query }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
      totalCount
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const UseShippingZonesSearch = makeTopLevelSearch<
  SearchShippingZonesQuery,
  SearchShippingZonesQueryVariables
>(SearchShippingZonesDocument);
