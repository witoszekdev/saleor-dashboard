import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { TokenArray } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  ProductWhereInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useMemo } from "react";
import { useLocation } from "react-router";

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

export const useReferenceProductSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const location = useLocation();
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const baseVariables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  // Read filter container from URL when modal is open (action=assign-attribute-value)
  const filterContainer = useMemo(() => {
    const params = new URLSearchParams(location.search);

    // Only parse filters if the assign attribute modal is open
    if (params.get("action") !== "assign-attribute-value") {
      return undefined;
    }

    // Remove non-filter params
    params.delete("action");
    params.delete("id");
    params.delete("asc");
    params.delete("sort");
    params.delete("activeTab");
    params.delete("query");
    params.delete("before");
    params.delete("after");

    const urlString = params.toString();

    if (!urlString) {
      return undefined;
    }

    try {
      const tokenArray = new TokenArray(urlString);

      return tokenArray.asFilterValueFromEmpty();
    } catch {
      return undefined;
    }
  }, [location.search]);

  const variables = useMemo(() => {
    if (!filterContainer || filterContainer.length === 0) {
      return baseVariables;
    }

    const conditionalFilterVars = createProductQueryVariables(filterContainer);
    const mergedWhere = mergeProductWhereFilters(baseVariables.where, conditionalFilterVars);

    return {
      ...baseVariables,
      where: mergedWhere,
      ...(conditionalFilterVars.channel?.eq ? { channel: conditionalFilterVars.channel.eq } : {}),
    };
  }, [baseVariables, filterContainer]);

  return useProductSearch({ variables });
};

export const useReferencePageSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const baseVariables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  // Note: PageFilterInput and PageWhereInput are incompatible types
  // The search query uses PageWhereInput but conditional filters create PageFilterInput
  // For now, we only support the base reference type filtering for pages
  // TODO: Add support for conditional filters when PageWhereInput filter conversion is available
  return usePageSearch({ variables: baseVariables });
};
