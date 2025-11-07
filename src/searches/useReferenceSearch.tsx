import { FilterContainer } from "@dashboard/components/ConditionalFilter/FilterElement";
import {
  createPageQueryVariables,
  createProductQueryVariables,
} from "@dashboard/components/ConditionalFilter/queryVariables";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  PageFilterInput,
  ProductWhereInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useMemo } from "react";

enum ReferenceType {
  ProductType = "ProductType",
  PageType = "PageType",
}

enum ReferenceWhereKey {
  ProductType = "productType",
  PageType = "pageType",
}

type AttributeWithReferenceTypes =
  | NonNullable<AttributeDetailsFragment>
  | NonNullable<VariantAttributeFragment>;

const getAllowedReferenceTypeIds = (
  refAttr: AttributeWithReferenceTypes | undefined,
  type: ReferenceType,
): string[] => {
  if (refAttr?.referenceTypes?.[0]?.__typename === type) {
    return (refAttr.referenceTypes ?? []).map(t => t?.id);
  }

  return [];
};

const buildReferenceSearchVariables = (
  allowedIds: string[] | undefined,
  whereKey: ReferenceWhereKey,
) => ({
  ...DEFAULT_INITIAL_SEARCH_DATA,
  ...(allowedIds?.length ? { where: { [whereKey]: { oneOf: allowedIds } } } : {}),
});

/**
 * Merges the reference type filter with conditional filter variables
 */
const mergeProductWhereFilters = (
  referenceTypeFilter: ProductWhereInput | undefined,
  conditionalFilter: ProductWhereInput,
): ProductWhereInput => {
  if (!referenceTypeFilter) {
    return conditionalFilter;
  }

  // Merge both filters using AND operator
  return {
    AND: [referenceTypeFilter, conditionalFilter].filter(Boolean),
  };
};

/**
 * Merges the reference type filter with conditional filter variables for pages
 */
const mergePageFilters = (
  referenceTypeFilter: PageFilterInput | undefined,
  conditionalFilter: PageFilterInput,
): PageFilterInput => {
  if (!referenceTypeFilter) {
    return conditionalFilter;
  }

  // For PageFilterInput, we need to merge the properties
  return {
    ...referenceTypeFilter,
    ...conditionalFilter,
  };
};

export const useReferenceProductSearch = (
  refAttr: AttributeWithReferenceTypes | undefined,
  filterContainer?: FilterContainer,
) => {
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const baseVariables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  const variables = useMemo(() => {
    if (!filterContainer || filterContainer.length === 0) {
      return baseVariables;
    }

    const conditionalFilterVars = createProductQueryVariables(filterContainer);
    const mergedWhere = mergeProductWhereFilters(baseVariables.where, conditionalFilterVars);

    return {
      ...baseVariables,
      ...conditionalFilterVars,
      where: mergedWhere,
    };
  }, [baseVariables, filterContainer]);

  return useProductSearch({ variables });
};

export const useReferencePageSearch = (
  refAttr: AttributeWithReferenceTypes | undefined,
  filterContainer?: FilterContainer,
) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const baseVariables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  const variables = useMemo(() => {
    if (!filterContainer || filterContainer.length === 0) {
      return baseVariables;
    }

    const conditionalFilterVars = createPageQueryVariables(filterContainer);
    const mergedWhere = mergePageFilters(baseVariables.where, conditionalFilterVars);

    return {
      ...baseVariables,
      where: mergedWhere,
    };
  }, [baseVariables, filterContainer]);

  return usePageSearch({ variables });
};
