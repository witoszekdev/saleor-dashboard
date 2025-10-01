// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchPagesDocument,
  SearchPagesQuery,
  SearchPagesQueryVariables,
} from "@dashboard/graphql";
import { makeTopLevelSearch } from "../hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchPages = gql`
  query SearchPages($after: String, $first: Int!, $query: String!, $where: PageWhereInput) {
    search: pages(after: $after, first: $first, search: $query, where: $where) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const UsePageSearch = makeTopLevelSearch<SearchPagesQuery, SearchPagesQueryVariables>(
  SearchPagesDocument,
);
