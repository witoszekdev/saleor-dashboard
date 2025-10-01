// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchCategoriesDocument,
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables,
  SearchCategoriesWithTotalProductsDocument,
  SearchCategoriesWithTotalProductsQuery,
  SearchCategoriesWithTotalProductsQueryVariables,
} from "@dashboard/graphql";

import { makeTopLevelSearch } from "../hooks/makeTopLevelSearch/makeTopLevelSearch";

export const searchCategories = gql`
  query SearchCategories($after: String, $first: Int!, $query: String!) {
    search: categories(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          ...CategoryWithAncestors
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const searchCategoriesWithTotalProducts = gql`
  query SearchCategoriesWithTotalProducts($after: String, $first: Int!, $query: String!) {
    search: categories(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          ...CategoryWithTotalProducts
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const useCategoryWithTotalProductsSearch = makeTopLevelSearch<
  SearchCategoriesWithTotalProductsQuery,
  SearchCategoriesWithTotalProductsQueryVariables
>(SearchCategoriesWithTotalProductsDocument);

export const UseCategorySearch = makeTopLevelSearch<
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables
>(SearchCategoriesDocument);
