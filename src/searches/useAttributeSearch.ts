// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchAttributesDocument,
  SearchAttributesQuery,
  SearchAttributesQueryVariables,
} from "@dashboard/graphql";

import { makeTopLevelSearch } from "../hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchAttributes = gql`
  query SearchAttributes($after: String, $first: Int!, $query: String!) {
    search: attributes(after: $after, first: $first, filter: { search: $query }) {
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

export const UseAttributeSearch = makeTopLevelSearch<
  SearchAttributesQuery,
  SearchAttributesQueryVariables
>(SearchAttributesDocument);
